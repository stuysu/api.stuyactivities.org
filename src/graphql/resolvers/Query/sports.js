export default (
	root,
	{ keyword },
	{
		models: {
			sports,
			Sequelize: {
				Op: { like }
			}
		}
	}
) =>
	sports.findAll({
		where: {
			name: { [like]: `%${keyword}%` },
		}
	})
