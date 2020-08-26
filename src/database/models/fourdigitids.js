'use strict';
import Dataloader from 'dataloader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class fourDigitIds extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			fourDigitIds.belongsTo(models.users);
		}

		static userIdLoader = new Dataloader(
			async userIds => {
				const userIdMap = {};
				const usedFourDigitMap = Array(10000).fill(false);

				const uniqueUserIds = [...new Set(userIds)];
				const results = await fourDigitIds.findAll({
					where: { userId: uniqueUserIds }
				});

				for (let x = 0; x < results.length; x++) {
					const id = results[x];
					userIdMap[id.userId] = id.value;
					usedFourDigitMap[id.value] = true;
				}

				const newRows = [];
				let lowestUnusedId = 1000;

				uniqueUserIds.forEach(userId => {
					if (!userIdMap[userId]) {
						while (
							lowestUnusedId < 10000 &&
							usedFourDigitMap[lowestUnusedId]
						) {
							lowestUnusedId++;
						}

						if (!usedFourDigitMap[lowestUnusedId]) {
							usedFourDigitMap[lowestUnusedId] = true;
							userIdMap[userId] = lowestUnusedId;
							newRows.push({
								userId,
								value: lowestUnusedId
							});
						}
					}
				});

				if (newRows.length) {
					await fourDigitIds.bulkCreate(newRows);
				}

				const response = [];
				for (let x = 0; x < userIds.length; x++) {
					const keyVal = userIds[x];
					response.push(userIdMap[keyVal] || null);
				}

				return response;
			},
			{ cache: false }
		);
	}
	fourDigitIds.init(
		{
			userId: DataTypes.INTEGER,
			value: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'fourDigitIds'
		}
	);
	return fourDigitIds;
};
