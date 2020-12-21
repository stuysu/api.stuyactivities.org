export default (root, { id }, { models }) =>
	models.organizations.findOne({ where: { id } });
