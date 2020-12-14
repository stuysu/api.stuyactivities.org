export default (root, { url }, { models }) =>
	models.organizations.findOne({ where: { url } });
