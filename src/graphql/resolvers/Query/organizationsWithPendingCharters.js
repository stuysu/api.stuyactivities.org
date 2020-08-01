export default (parent, args, { models, session }) => {
	session.authenticationRequired();

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
