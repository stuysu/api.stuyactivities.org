module.exports = async (root, args, context) => {
	const {
		keyword,
		tags,
		commitmentLevels,
		meetingDays,
		meetingFrequency,
		limit,
		offset
	} = args;

	const { models } = context;
	const { Op } = models.Sequelize;

	const filterParams = {
		where: {
			active: true
		},
		include: [],
		limit,
		offset
	};

	let min = 1;
	let max = 20;

	// If they are provided, update the default
	if (meetingFrequency) {
		min = meetingFrequency.min;
		max = meetingFrequency.max;
	}

	const charterInclude = {
		model: models.charters,
		where: {
			[Op.and]: [
				{
					meetingFrequency: {
						[Op.gte]: min,
						[Op.lte]: max
					}
				}
			]
		},
		required: true
	};

	if (Array.isArray(commitmentLevels) && commitmentLevels.length > 0) {
		charterInclude.where[Op.and].push({
			commitmentLevel: commitmentLevels
		});
	}

	if (Array.isArray(meetingDays) && meetingDays.length > 0) {
		charterInclude.where[Op.and].push({
			[Op.or]: meetingDays.map(day => ({
				meetingDays: {
					[Op.iLike]: `%${day.toLowerCase()}%`
				}
			}))
		});
	}

	filterParams.include.push(charterInclude);

	if (keyword) {
		const charterFieldsToCheck = Object.keys(models.charters.rawAttributes);
		charterFieldsToCheck.splice(
			charterFieldsToCheck.indexOf('createdAt'),
			1
		);
		charterFieldsToCheck.splice(
			charterFieldsToCheck.indexOf('updatedAt'),
			1
		);

		const orParams = {
			name: {
				[Op.iLike]: `%${keyword}%`
			},
			url: {
				[Op.iLike]: `%${keyword}%`
			}
		};

		charterFieldsToCheck.forEach(field => {
			orParams[`$charter.${field}$`] = {
				[Op.iLike]: `%${keyword}%`
			};
		});

		filterParams.where[Op.or] = orParams;
	}

	if (Array.isArray(tags) && tags.length > 0) {
		filterParams.include.push({
			model: models.tags,
			where: {
				name: tags
			},
			required: true
		});
	}

	return models.organizations.findAll(filterParams);
};
