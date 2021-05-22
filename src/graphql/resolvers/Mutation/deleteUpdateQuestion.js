import { ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ updateQuestionId },
	{ models, authenticationRequired, isOrgAdmin, user }
) => {
	authenticationRequired();

	const updateQuestion = await models.updateQuestions.findOne({
		where: {
			id: updateQuestionId
		},
		include: {
			model: models.updates
		}
	});

	if (!updateQuestion) {
		throw new ForbiddenError(
			"That update question either doesn't exist or you don't have the permission to delete it."
		);
	}

	if (
		updateQuestion.userId !== user.id ||
		!isOrgAdmin(updateQuestion.update.organizationId)
	) {
		throw new ForbiddenError(
			"You don't have permission to delete that question"
		);
	}

	await updateQuestion.destroy();

	return true;
};
