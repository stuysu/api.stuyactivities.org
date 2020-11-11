import { UserInputError, ApolloError } from 'apollo-server-errors';

export default async (
	root,
	{ updateId, question },
	{ models: { updateQuestions, updates }, session }
) => {
	session.authenticationRequired(['createUpdateQuestion']);

	if (!question || !updateId) {
		throw new UserInputError(
			'You must provide an update id and a question to submit a question',
			{ invalidArgs: ['createUpdateQuestion'] }
		);
	}

	const update = await updates.idLoader.load(updateId);
	if (!update) {
		throw new ApolloError(
			"There's no update with that ID",
			'UPDATE_NOT_FOUND'
		);
	}

	return await updateQuestions.create({
		updateId: update.id,
		userId: session.userId,
		question
	});
};
