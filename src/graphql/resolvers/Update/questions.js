export default async (update, args, { session, models }) => {
	let questions = await models.updateQuestions.updateIdLoader.load(update.id);

	const membership = (await session.getMemberships()).find(
		membership => membership.organizationId === update.organizationId
	);
	const isAdmin = membership && membership.adminPrivileges;

	questions = questions.filter(question => {
		if (isAdmin) return true;
		if (!question.answer) return false;
		if (question.userId === session.userId) return true;
		if (question.private) return false;
		return true;
	});

	questions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	return questions;
};
