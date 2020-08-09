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

	const { org, message } = args;

	if (!org || !message) {
		throw new UserInputError(
			'The organization ID and message are required to make a comment!',
			{
				invalidArgs: ['org', 'message']
			}
		);
	}

	//see if user is an admin
	const isAdmin = await memberships.findOne({
		where: {
			userId: session.userId,
			adminPrivileges: true,
			organizationId: org
		}
	});
	if (!isAdmin) {
		session.authenticationRequired(['charters']);
	}

	//Make sure the organization exists
	const organization = await organizations.findOne({ where: { id: org } });
	if (!organization) {
		throw new ApolloError(
			'Could not find an organization with that id',
			'ORG_NOT_FOUND'
		);
	}

	// Make the comment
	return await charterApprovalMessages.create({
		organizationId: org,
		userId: session.userId,
		message,
		auto: false,
		seen: false
	});
};
