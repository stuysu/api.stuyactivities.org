module.exports = async (root, args, context) => {
	const {
		with: {
			keyword,
			tags,
			commitmentLevels,
			meetingDays,
			meetingFrequency: { min, max }
		},
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

	if (Array.isArray(tags)) {
		filterParams.include.push({
			model: models.tags,
			where: {
				name: tags
			},
			required: true
		});
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

	if (keyword) {
		filterParams.where[Op.or] = {
			name: {
				[Op.like]: `%${keyword}%`
			},
			url: {
				[Op.like]: `%${keyword}%`
			}
		};

		const fieldsToCheck = Object.keys(models.charters.rawAttributes);
		fieldsToCheck.splice(fieldsToCheck.indexOf('createdAt'), 1);
		fieldsToCheck.splice(fieldsToCheck.indexOf('updatedAt'), 1);

		const charterFilter = {
			[Op.or]: fieldsToCheck.map(field => ({
				[field]: {
					[Op.like]: `%${keyword}%`
				}
			}))
		};

		charterInclude.where[Op.and].push(charterFilter);
	}

	if (Array.isArray(commitmentLevels)) {
		charterInclude.where[Op.and].push({
			commitmentLevel: commitmentLevels
		});
	}

	if (Array.isArray(meetingDays)) {
		charterInclude.where[Op.and].push({
			meetingDays
		});
	}

	return models.organizations.findAll(filterParams);
};
