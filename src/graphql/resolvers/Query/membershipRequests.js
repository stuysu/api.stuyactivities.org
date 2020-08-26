import { UserInputError } from 'apollo-server-express';

export default (parent, { orgUrl, orgId }, { models }) => {
	if (!orgUrl && !orgId) {
		throw new UserInputError(
			'You need to provide an organization id or url to query members',
			{ invalidArgs: ['orgId', 'orgUrl'] }
		);
	}

	if (orgId) {
		return models.membershipRequests.orgIdLoader.load(orgId);
	}

	if (orgUrl) {
		return models.membershipRequests.findAll({
			include: {
				model: models.organizations,
				where: { url: orgUrl },
				required: true
			}
		});
	}
};
