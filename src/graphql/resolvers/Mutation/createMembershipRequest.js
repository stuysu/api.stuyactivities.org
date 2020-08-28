import { ForbiddenError, UserInputError } from 'apollo-server-errors';

export default async (
	root,
	{ orgId, orgUrl, message },
	{ models: { membershipRequests, organizations, memberships }, session }
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

	// make sure the organization exists
	let org;

	if (orgId) {
		org = await organizations.idLoader.load(orgId);
	} else if (orgUrl) {
		org = await organizations.urlLoader.load(orgUrl);
	}

	// Check to see if the user is already a member
	const alreadyMember = await memberships.findOne({
		where: {
			userId: session.userId,
			organizationId: org.id
		}
	});

	if (alreadyMember) {
		throw new ForbiddenError(
			'You are already a member of this organization'
		);
	}

	const alreadySubmitted = await membershipRequests.findOne({
		where: {
			userId: session.userId,
			organizationId: org.id
		}
	});

	if (alreadySubmitted) {
		throw new ForbiddenError(
			'You have already submitted a request to join this organization'
		);
	}

	return await membershipRequests.create({
		organizationId: org.id,
		userId: session.userId,
		role: 'Member',
		adminPrivileges: false,
		userMessage: message,
		adminMessage: null,
		userApproval: true,
		adminApproval: false
	});
};
