'use strict';
import { Model } from 'sequelize';
import DataLoader from 'dataloader';
import findOneLoader from '../dataloaders/findOneLoader';
module.exports = (sequelize, DataTypes) => {
	class tags extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */

		static orgIdLoader;
		static idLoader = findOneLoader(tags, 'id');
		static associate(models) {
			// define association here
			tags.belongsToMany(models.organizations, {
				through: models.orgTags
			});

			this.orgIdLoader = new DataLoader(async orgIds => {
				const allTags = await this.findAll();

				const tagMap = {};

				allTags.forEach(tag => {
					tagMap[tag.id] = tag;
				});

				const orgTags = await models.orgTags.findAll({
					where: { organizationId: orgIds }
				});

				const orgIdTagMap = {};

				orgTags.forEach(orgTag => {
					if (!orgIdTagMap[orgTag.organizationId]) {
						orgIdTagMap[orgTag.organizationId] = [];
					}

					orgIdTagMap[orgTag.organizationId].push(
						tagMap[orgTag.tagId]
					);
				});

				return orgIds.map(orgId => orgIdTagMap[orgId] || []);
			});
		}
	}
	tags.init(
		{
			name: DataTypes.STRING,
			description: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'tags'
		}
	);
	return tags;
};
