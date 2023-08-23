import { ForbiddenError } from 'apollo-server-express';

export default async (
	root,
	{ orgId, name },
	{ orgAdminRequired, models: { groups, organizations }, user }
) => {
	orgAdminRequired(orgId);

	const org = await organizations.idLoader.load(orgId);

	if (!org.active) {
		throw new ForbiddenError(
			'Only approved organizations are allowed to create groups.'
		);
	}

	if (org.locked) {
		throw new ForbiddenError('Locked organizations may not create groups.');
	}

	if (!orgId || !name) {
		throw new UserInputError(
			'You must provide an organization id and a group name.',
			{ invalidArgs: ['createGroup'] }
		);
	}

	const alreadyExists = await groups.findOne({
		where: {
			organizationId: orgId,
			name
		}
	});

	if (alreadyExists) {
		throw new ForbiddenError('A group with this name already exists.');
	}

	return await groups.create({
		organizationId: orgId,
		name
	});
};
