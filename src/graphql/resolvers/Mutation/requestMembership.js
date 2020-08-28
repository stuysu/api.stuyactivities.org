import {
	ApolloError,
	UserInputError
} from 'apollo-server-express';
export default async (parent, args, context) => {
	const {
		session,
		models: {
			memberships,
			organizations,
			membershipRequests,
			Sequelize: { Op }
		}
	} = context;

	const { orgId, role, adminPrivileges, message } = args;

	if (!orgId) {
		throw new UserInputError(
			'The organization ID is required to make a membership request!',
			{
				invalidArgs: ['orgId']
			}
		);
	}

	//Make sure the organization exists
	const organization = await organizations.findOne({ where: { id: orgId } });
	if (!organization) {
		throw new ApolloError(
			'Could not find an organization with that id',
			'ORG_NOT_FOUND'
		);
	}
	//See if the user is a member
	const membership = await memberships.findOne({where: {id: orgId, userId: session.userId}})
	if (membership) {
		throw new ApolloError(
			"You are already a member of this club!",
			"MEMBERSHIP_ALREADY_EXISTS"
		)
	}

	//See if the user has a membership request
	const existingRequest = await membershipRequests.findOne({where: {organizationId: orgId, userId: session.userId}})
	if (existingRequest) {
		//update existing request
		membershipRequests.update({
			role: role || existingRequest.role,
			adminPrivileges: adminPrivileges === undefined ? existingRequest.adminPrivileges : adminPrivileges,
			userMessage: message || existingRequest.userMessage
		})
		//TODO: is there a way to circumvent another request?
		return await membershipRequests.findOne({where: {organizationId: orgId, userId: session.userId}})
	}
	return await membershipRequests.create({
		organizationId: orgId,
		userId: session.userId,
		role: role || "Member",
		adminPrivileges: adminPrivileges || 0,
		userMessage: message || "",
		userApproval: 1
	})
};
