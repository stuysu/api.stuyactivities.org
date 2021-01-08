export default (query, { id }, { models }) =>
	models.users.findOne({ where: { id } });
