import { ForbiddenError } from 'apollo-server-errors';

export default async (root, { updateId }, { models, session }) => {
	session.authenticationRequired(['deleteUpdate']);

	// If the user is not an admin the update won't be found
	// Quick way to fetch the update and check privileges in one query
	const update = await models.updates.findOne({
		where: {
			id: updateId
		},
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
		}
	});

	if (!update) {
		throw new ForbiddenError(
			"That update either doesn't exist or you don't have permission to modify it."
		);
	}

	await update.destroy();

	return true;
};
