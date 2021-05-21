import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-errors';

export default async (
	root,
	{ requestId, message },
	{
		authenticationRequired,
		user,
		hasAdminRole,
		models: { helpRequests, helpRequestMessages }
	}
) => {
	authenticationRequired();

	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	const isAdmin = hasAdminRole('helpRequests');

	if (request.userId !== user.id && !isAdmin) {
		throw new ForbiddenError(
			'You are not allowed to create a message on this request.'
		);
	}

	if (!message) {
		throw new UserInputError('Message cannot be left empty');
	}

	if (message.length > 10000) {
		throw new UserInputError(
			'Message is too long. If you need to convey a lot of information, break it up into multiple messages'
		);
	}

	const role = isAdmin ? 'admin' : 'user';

	return await helpRequestMessages.create({
		helpRequestId: request.id,
		userId: user.id,
		role,
		message
	});
};
