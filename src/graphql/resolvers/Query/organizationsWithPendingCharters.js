export default async (parent, args, { models, adminRoleRequired }) => {
	adminRoleRequired('charters');

	return models.organizations.findAll({
		include: [
			{
				model: models.charterEdits,
				where: {
					status: 'pending'
				}
			}
		]
	});
};
