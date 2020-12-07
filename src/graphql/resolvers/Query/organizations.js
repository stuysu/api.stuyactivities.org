const isUsingMysql =
	process.env.SEQUELIZE_URL &&
	new URL(process.env.SEQUELIZE_URL).protocol === 'mysql';

export default async (root, args, context) => {
	const {
		keyword,
		tags,
		commitmentLevels,
		meetingDays,
		limit,
		offset,
		randomOrderSeed
	} = args;

	const { models, ipAddress } = context;
	const { Op } = models.Sequelize;

	const filterParams = {
		where: {
			active: true
		},
		include: []
	};

	if (limit) {
		filterParams.limit = limit;
	}

	if (offset) {
		filterParams.offset = offset;
	}

	if (!keyword && typeof randomOrderSeed === 'number' && isUsingMysql) {
		filterParams.order = [models.sequelize.fn('RAND', randomOrderSeed)];
	}

	const charterInclude = {
		model: models.charters,
		where: {
			[Op.and]: []
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
					[Op.like]: `%${day.toLowerCase()}%`
				}
			}))
		});
	}

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
				[Op.like]: `%${keyword}%`
			},
			url: {
				[Op.like]: `%${keyword}%`
			}
		};

		charterFieldsToCheck.forEach(field => {
			orParams[`$charter.${field}$`] = {
				[Op.like]: `%${keyword}%`
			};
		});

		filterParams.where[Op.or] = orParams;
	}

	const tagsInclude = {
		model: models.tags
	};

	if (Array.isArray(tags) && tags.length > 0) {
		tagsInclude.required = true;
		tagsInclude.where = {
			id: tags
		};
	}

	filterParams.include.push(charterInclude);
	filterParams.include.push(tagsInclude);

	const results = await models.organizations.findAll(filterParams);

	if (keyword) {
		const lowerKeyword = keyword.toLowerCase();
		results.sort((a, b) => {
			if (a.name.toLowerCase().includes(lowerKeyword)) {
				return -1;
			}

			if (b.name.toLowerCase().includes(lowerKeyword)) {
				return 1;
			}

			if (
				a.charter.mission &&
				a.charter.mission.toLowerCase().includes(lowerKeyword)
			) {
				return -1;
			}

			if (
				b.charter.mission &&
				b.charter.mission.toLowerCase().includes(lowerKeyword)
			) {
				return 1;
			}

			return 0;
		});
	}

	return results;
};
