export default async (parent, args, { models, session }) => {
	session.authenticationRequired();

	await session.adminRoleRequired('charters', [
		'organizationsWithPendingCharters'
	]);

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
