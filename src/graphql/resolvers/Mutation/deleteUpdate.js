import { ForbiddenError } from 'apollo-server-errors';

export default async (root, { updateId }, { models, orgAdminRequired }) => {
	// If the user is not an admin the update won't be found
	// Quick way to fetch the update and check privileges in one query
	const update = await models.updates.findOne({
		where: {
			id: updateId
		}
	});

	if (!update) {
		throw new ForbiddenError('There is no update with that id');
	}

	orgAdminRequired(update.organizationId);

	await update.destroy();
};
