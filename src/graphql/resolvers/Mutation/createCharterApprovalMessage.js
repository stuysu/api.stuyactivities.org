import {
	ApolloError,
	UserInputError,
	ForbiddenError
} from 'apollo-server-express';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: {
			memberships,
			organizations,
			charterEdits,
			charterApprovalMessages,
			Sequelize: { Op }
		}
	} = context;

	const { orgId, message } = args;

	if (!orgId || !message) {
		throw new UserInputError(
			'The organization ID and message are required to make a comment!',
			{
				invalidArgs: ['orgId', 'message']
			}
		);
	}

	//see if user is an admin
	const isAdmin = await memberships.findOne({
		where: {
			userId: session.userId,
			adminPrivileges: true,
			organizationId: orgId
		}
	});
	if (!isAdmin) {
		session.authenticationRequired(['charters']);
	}

	//Make sure the organization exists
	const organization = await organizations.findOne({ where: { id: orgId } });
	if (!organization) {
		throw new ApolloError(
			'Could not find an organization with that id',
			'ORG_NOT_FOUND'
		);
	}

	// Make the comment
	return await charterApprovalMessages.create({
		organizationId: orgId,
		userId: session.userId,
		message,
		auto: false,
		seen: false
	});
};
