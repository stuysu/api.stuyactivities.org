'use strict';
import DataLoader from 'dataloader';
import cloudinaryResourceLoader from '../../utils/cloudinaryResourceLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class cloudinaryResources extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}

		static idLoader = new DataLoader(async publidIds => {
			const ids = Array.from(new Set(publidIds));

			const idMap = {};

			const storedResources = await cloudinaryResources.findAll({
				where: { id: publidIds }
			});

			storedResources.forEach(resource => {
				idMap[resource.id] = resource;
			});

			const missingIds = ids.filter(id => !Boolean(idMap[id]));

			const dynamicallyLoadedDetails = await Promise.all(
				missingIds.map(id => cloudinaryResourceLoader.load(id))
			);

			const newDetails = dynamicallyLoadedDetails
				.filter(Boolean)
				.map(details => ({
					id: details.public_id,
					assetId: details.asset_id,
					width: details.width,
					height: details.height,
					format: details.format,
					resourceType: details.resource_type,
					createdAt: details.created_at
				}));

			const newRows = await cloudinaryResources.bulkCreate(newDetails, {
				returning: true
			});

			newRows.forEach(resource => {
				idMap[resource.id] = resource;
			});

			return ids.map(id => idMap[id] || null);
		});
	}
	cloudinaryResources.init(
		{
			id: DataTypes.STRING,
			assetId: DataTypes.STRING,
			width: DataTypes.INTEGER,
			height: DataTypes.INTEGER,
			format: DataTypes.STRING,
			resourceType: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'cloudinaryResources'
		}
	);
	return cloudinaryResources;
};
