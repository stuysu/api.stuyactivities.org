import {
	ApolloError,
	UserInputError,
	ForbiddenError
} from 'apollo-server-express';
import isClubAdmin from '../../../utils/isClubAdmin';
import sendEmail from '../../../utils/sendEmail';

export default async (parent, args, context) => {
	const { orgId, userId } = args;
	const {
		session,
		models: { memberships, membershipRequests }
	} = context;

	if (!orgId || !userId) {
		throw new UserInputError(
			'The organization ID (orgId) and user ID (userId) are required to approve a membership request!',
			{ invalidArgs: ['orgId', 'userId'] }
		);
	}
	//see if user is an admin
	if (!isClubAdmin(session.userId, orgId, memberships)) {
		throw new ForbiddenError(
			'You do not have the right to remove members from this club!'
		);
	}

	const membershipRequest = await membershipRequests.findOne({
		where: {
			organizationId: orgId,
			userId,
			userApproval: true
		}
	});
	if (!membershipRequest) {
		throw new ApolloError(
			'Could not find an incoming membership request with that userId and that orgId',
			'REQUEST_NOT_FOUND'
		);
	}

	const membership = await memberships.create({
		userId,
		organizationId: orgId,
		role: membershipRequest.role,
		adminPrivileges: membershipRequest.adminPrivileges
	});

	const user = await membershipRequest.getUser();
	const organization = await membershipRequest.getOrganization();
	await sendEmail({
		to: user.email,
		subject: 'You have been added to a club',
		template: 'memberAdded.html',
		variables: {
			user,
			organization
		}
	});
	return membership;
};
