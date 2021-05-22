import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		models: { organizations, charterApprovalMessages },
		authenticationRequired,
		hasAdminRole,
		isOrgAdmin,
		user
	} = context;
	const { orgId, message } = args;

	const org = await organizations.idLoader.load(orgId);

	if (!org) {
		throw new ApolloError(
			"There's no organization with that id",
			'ID_NOT_FOUND'
		);
	}

	authenticationRequired();

	const isAdmin = hasAdminRole('charters');

	const hasOrgAdmin = isOrgAdmin(orgId);

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
		userId: user.id,
		message,
		auto: false,
		seen: false
	});
};
