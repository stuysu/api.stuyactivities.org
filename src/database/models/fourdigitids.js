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
				const idUsedMap = Array(10000).fill(false);
				const allFourDigits = await fourDigitIds.findAll();
				const userIdMap = {};

				for (let i = 0; i < allFourDigits; i++) {
					const id = allFourDigits[i];
					idUsedMap[id.value] = true;
					userIdMap[id.userId] = id.value;
				}

				const response = [];
				const newRows = [];
				let lowestUnusedId = 1000;

				for (let x = 0; x < userIds.length; x++) {
					const userId = userIds[x];
					const existingVal = userIdMap[userId];
					if (existingVal) {
						response.push(existingVal);
					} else {
						while (
							lowestUnusedId < 9999 &&
							idUsedMap[lowestUnusedId]
						) {
							lowestUnusedId++;
						}
						if (!idUsedMap[lowestUnusedId]) {
							idUsedMap[lowestUnusedId] = true;
							userIdMap[userId] = lowestUnusedId;
							newRows.push({
								userId,
								value: lowestUnusedId
							});
							response.push(lowestUnusedId);
						} else {
							// There aren't any four digit ids left
							response.push(null);
						}
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
