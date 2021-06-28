import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';

export default async (
	parent,
	{ strikeId, message },
	{
		models: { organizations, strikeComments, strikes },
		authenticationRequired,
		user,
		hasAdminRole,
		isOrgAdmin
	}
) => {
	authenticationRequired();

	const strike = await strikes.strikeIdLoader.load(strikeId);

	if (!strike) {
		throw new ApolloError("There's no strike with that id", 'ID_NOT_FOUND');
	}

	const org = await organizations.idLoader.load(strike.organizationId);

	const isAdmin = hasAdminRole('strikes');

	const hasOrgAdmin = isOrgAdmin(org.id);

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
	return await strikeComments.create({
		strikeId: strikeId,
		userId: user.id,
		message,
		auto: false,
		seen: false
	});
};
