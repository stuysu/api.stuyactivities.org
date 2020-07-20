module.exports = {
	organization: model => model.getOrganization(),

	days: model => (model.days ? JSON.parse(model.days) : null)
};
