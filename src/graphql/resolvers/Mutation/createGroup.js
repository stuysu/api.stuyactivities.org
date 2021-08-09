import { ForbiddenError } from 'apollo-server-express';

export default async (
	root,
	{ orgId, name },
	{ orgAdminRequired, models: { groups }, user }
) => {

	orgAdminRequired(orgId);

	if (!orgId || !name) {
		throw new UserInputError(
			'You must provide an organization id and a group name.',
			{ invalidArgs: ['createGroup'] }
		);
	}

	const alreadyExists = await groups.findOne({
		where: {
			orgId,
			name,
		}
	});

	if (alreadyExists) {
		throw new ForbiddenError(
			'A group with this name already exists.'
		);
	}

	return await groups.create({
		organizationId: orgId,
		name,
	});
}