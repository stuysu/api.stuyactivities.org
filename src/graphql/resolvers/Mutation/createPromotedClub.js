import { ApolloError, UserInputError } from 'apollo-server-errors';

export default async (
	parent,
	{ orgId, blurb },
	{ models, adminRoleRequired }
) => {
	adminRoleRequired('promotedClubs');

	const org = await models.organizations.idLoader.load(orgId);

	if (!org) {
		throw new ApolloError(
			"There's no organization with that id",
			'ID_NOT_FOUND'
		);
	}

	if (!blurb) {
		throw new UserInputError('Blurb cannot be left empty', {
			invalidArgs: ['blurb']
		});
	}

	return await models.promotedClubs.create({
		organizationId: orgId,
		blurb
	});
};
