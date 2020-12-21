export default (root, { orgId }, { models }) =>
	models.charters.orgIdLoader.load(orgId);
