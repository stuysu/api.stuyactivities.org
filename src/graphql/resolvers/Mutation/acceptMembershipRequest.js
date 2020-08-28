import { ApolloError, ForbiddenError } from 'apollo-server-errors';
import { shareCalendar } from '../../../googleApis/calendar';
import sendEmail from '../../../utils/sendEmail';

export default async (
	root,
	{ requestId },
	{
		models: {
			membershipRequests,
			memberships,
			googleCalendars,
			organizations,
			users
		},
		session
	}
) => {
	session.authenticationRequired(['acceptMembershipRequest']);

	const request = await membershipRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no membership request with that id.',
			'ID_NOT_FOUND'
		);
	}

	// That means this is an invite and the user hasn't yet approved
	if (request.adminApproval) {
		if (session.userId !== request.userId) {
			throw new ForbiddenError(
				'Only the user the request belongs to may accept it.'
			);
		}

		request.userApproval = true;
	} else {
		// this is an admin approving it for the user
		await session.orgAdminRequired(request.organizationId);
		request.adminApproval = true;
	}

	await request.save();

	const mem = await memberships.create({
		organizationId: request.organizationId,
		userId: request.userId,
		role: request.role,
		adminPrivileges: request.adminPrivileges
	});

	const org = await organizations.idLoader.load(request.organizationId);

	const newUser = await users.idLoader.load(request.userId);

	if (org.active) {
		const calendarAssoc = await googleCalendars.orgIdLoader.load(org.id);
		await shareCalendar(calendarAssoc.gCalId, newUser.email, 'reader');
	}

	await sendEmail({
		to: newUser.email,
		template: 'joinConfirmation.html',
		subject: `Membership Approved ${org.name} | StuyActivities`,
		variables: {
			user: newUser,
			org
		}
	});

	return request;
};
