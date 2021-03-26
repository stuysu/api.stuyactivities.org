'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import DataLoader from 'dataloader';

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

		static userIdLoader = findOneLoader(fourDigitIds, 'userId');

		static userIdCreateLoader = new DataLoader(
			async userIds => {
				const availableIds = new Set(
					Array(10000 - 1000)
						.fill(1000)
						.map((a, index) => a + index)
				);

				const allFourDigits = await fourDigitIds.findAll();
				const userIdMap = {};

				for (let i = 0; i < allFourDigits; i++) {
					const id = allFourDigits[i];
					userIdMap[id.userId] = id.value;
					availableIds.delete(id.value);
				}

				const response = [];
				const newRows = [];

				const availableIdsArray = [...availableIds];

				for (let x = 0; x < userIds.length; x++) {
					const userId = userIds[x];
					const existingVal = userIdMap[userId];
					if (existingVal) {
						response.push(existingVal);
					} else {
						const unusedId = availableIdsArray.pop();
						// If they don't have an id assign them something
						userIdMap[userId] = unusedId;
						newRows.push({
							userId,
							value: unusedId
						});
						response.push(unusedId);
					}
				}

				await fourDigitIds.bulkCreate(newRows);
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
