export default (root, { orgUrl }, { models }) =>
	models.charters.findOne({
		include: {
			model: models.organizations,
			where: {
				url: orgUrl
			},
			required: true
		}
	});
