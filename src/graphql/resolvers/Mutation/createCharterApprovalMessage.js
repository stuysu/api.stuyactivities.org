import {
	ApolloError,
	ForbiddenError,
	UserInputError
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

	const org = await organizations.idLoader.load(orgId);

	if (!org) {
		throw new ApolloError(
			"There's no organization with that id",
			'ID_NOT_FOUND'
		);
	}

	session.authenticationRequired(['createCharterApprovalMessage']);

	const isAdmin = await session.adminRoleRequired(
		'charters',
		['createCharterApprovalMessage'],
		true
	);

	const hasOrgAdmin = await session.orgAdminRequired(
		orgId,
		['createCharterApprovalMessage'],
		true
	);

	if (!isAdmin && !hasOrgAdmin) {
		throw new ForbiddenError(
			'Only club admins or StuyActivities admins are allowed to send messages'
		);
	}

	if (!message) {
		throw new UserInputError('The message cannot be left empty', {
			invalidArgs: ['message']
		});
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
