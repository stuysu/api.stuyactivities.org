import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-errors';

export default async (
	root,
	{ requestId, message },
	{ session, models: { helpRequests, helpRequestMessages } }
) => {
	session.authenticationRequired(['createHelpRequestMessage']);

	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	const isAdmin = await session.adminRoleRequired(
		'helpRequests',
		['createHelpRequestMessage'],
		true
	);

	if (request.userId !== session.userId && !isAdmin) {
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
		userId: session.userId,
		role,
		message
	});
};
