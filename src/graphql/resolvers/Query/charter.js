import { UserInputError } from 'apollo-server-express';

export default (parent, { orgUrl, orgId, id }, { models }) => {
	if (!orgUrl && !orgId && !id) {
		throw new UserInputError(
			'You must provide an organization ID, organization url or charter id to query charters',
			{ invalidArgs: ['orgUrl', 'orgId', 'id'] }
		);
	}

	if (id) {
		return models.charters.idLoader.load(id);
	}

	if (orgId) {
		return models.charters.orgIdLoader.load(orgId);
	}

	if (orgUrl) {
		return models.charters.findOne({
			include: [
				{
					model: models.organizations,
					where: { url: orgUrl },
					required: true
				}
			]
		});
	}
};
