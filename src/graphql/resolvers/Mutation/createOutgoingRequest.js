import { ForbiddenError, UserInputError } from 'apollo-server-errors';
import { PUBLIC_URL } from '../../../constants';
import sendEmail from '../../../utils/sendEmail';
import urlJoin from 'url-join';

export default async (
	root,
	{ orgId, orgUrl, userId, message, admin, role },
	{ models: { membershipRequests, organizations, memberships, users }, session }
) => {
	session.authenticationRequired(['createMembershipRequest']);

	if (message && message.length > 1000) {
		throw new UserInputError(
			'The join request message cannot be longer than 1000 characters.',
			{
				invalidArgs: ['message']
			}
		);
	}

	if (!orgId && !orgUrl) {
		throw new UserInputError(
			'You must provide an organization id or url in order to submit a join request',
			{ invalidArgs: ['createMembershipRequest'] }
		);
	}
	if (!userId) {
		throw new UserInputError(
			'You must provide a userId in order to submit an outgoing join request',
			{ invalidArgs: ['createMembershipRequest'] }
		);
	}

	// make sure the organization exists
	let org;

	if (orgId) {
		org = await organizations.idLoader.load(orgId);
	} else if (orgUrl) {
		org = await organizations.urlLoader.load(orgUrl);
	}
	// make sure requester is admin
	await session.orgAdminRequired(org.id);

	// Check to see if the user is already a member
	const alreadyMember = await memberships.findOne({
		where: {
			userId: userId,
			organizationId: org.id
		}
	});

	if (alreadyMember) {
		throw new ForbiddenError(
			'The person who you want to join your organization is already a member'
		);
	}

	const alreadySubmitted = await membershipRequests.findOne({
		where: {
			userId: userId,
			organizationId: org.id
		}
	});

	if (alreadySubmitted) {
		throw new ForbiddenError(
			'You have already submitted a request to add this user to this organization'
		);
	}

	const joinUrl = urlJoin(PUBLIC_URL, org.url, 'join');
	const invitee = await users.findOne({where: {id: userId}});
	const inviter = await users.findOne({where: {id: session.userId}});
	const adminMessage = message || `${inviter.firstName} ${inviter.lastName} is asking you to join as a leader of the organization ${org.name} on StuyActivities.`;
	await sendEmail({
		to: invitee.email,
		subject: `Request to join ${org.name} | StuyActivities`,
		template: 'orgLeaderInvite.html',
		variables: {
			invitee,
			inviter,
			org,
			joinUrl,
			role: role || 'Member'
		}
	});

	return await membershipRequests.create({
		organizationId: org.id,
		userId: userId,
		role: role || 'Member',
		adminPrivileges: admin || false,
		userMessage: null,
		adminMessage: adminMessage,
		userApproval: false,
		adminApproval: true
	});
};
