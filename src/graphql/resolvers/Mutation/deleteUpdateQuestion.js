import { ForbiddenError } from 'apollo-server-errors';

export default async (root, { updateQuestionId }, { models, session }) => {
	session.authenticationRequired(['deleteUpdateQuestion']);

	const updateQuestion = await models.updateQuestions.findOne({
		where: {
			id: updateQuestionId
		},
		include: {
			model: models.updates,
			include: {
				model: models.organizations,
				include: {
					model: models.memberships,
					where: {
						userId: session.userId,
						adminPrivileges: true
					},
					required: true
				},
				required: true
			},
			required: true
		}
	});

	if (!updateQuestion) {
		throw new ForbiddenError(
			"That update question either doesn't exist or you don't have the permission to delete it."
		);
	}

	await updateQuestion.destroy();

	return true;
};
