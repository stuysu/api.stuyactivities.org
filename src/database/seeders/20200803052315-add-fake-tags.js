import faker from 'faker';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */

		const now = new Date();
		const numTags = Math.floor(Math.random() * 8) + 8;
		const fakeTags = Array(numTags)
			.fill(0)
			.map(() => ({
				name: faker.random.words(Math.floor(Math.random() * 2) + 1),
				description: faker.lorem.words(14),
				createdAt: now,
				updatedAt: now
			}));

		await queryInterface.bulkInsert('tags', fakeTags);

		const dbTags = await queryInterface.sequelize.query(
			'SELECT * FROM tags',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const dbOrgs = await queryInterface.sequelize.query(
			'SELECT * FROM organizations',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const orgTagProps = [];
		dbOrgs.forEach(org => {
			let numTags = 0;
			const tags = dbTags.filter(() => {
				if (numTags < 3 && Math.random() < 0.6) {
					numTags++;
					return true;
				}

				return false;
			});

			tags.forEach(tag =>
				orgTagProps.push({
					organizationId: org.id,
					tagId: tag.id,
					createdAt: now,
					updatedAt: now
				})
			);
		});

		await queryInterface.bulkInsert('orgTags', orgTagProps);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
