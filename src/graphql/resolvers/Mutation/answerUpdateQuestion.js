import { ApolloError } from 'apollo-server-errors';
import sendEmail from '../../../utils/sendEmail';

export default async (
	root,
	params,
	{ models: { updates, users, updateQuestions }, session }
) => {
	const updateQuestion = await updateQuestions.idLoader.load(
		params.updateQuestionId
	);
	if (!updateQuestion) {
		throw new ApolloError(
			"There's no update question with that ID",
			'UPDATE_QUESTION_NOT_FOUND'
		);
	}

	const update = await updates.idLoader.load(updateQuestion.updateId);
	await session.orgAdminRequired(update.organizationId);

	updateQuestion.answer = params.answer;
	updateQuestion.private = params.private;

	await updateQuestion.save();

	const askingUser = await users.idLoader.load(updateQuestion.userId);

	await sendEmail({
		to: askingUser.email,
		subject: 'Your question has been answered | StuyActivties',
		template: 'questionAnswered.html',
		variables: {
			user: askingUser,
			question: updateQuestion
		}
	});

	return updateQuestion;
};
