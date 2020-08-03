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
		const users = Array(500)
			.fill(0)
			.map(() => {
				const gradYear = Math.floor(Math.random() * 4) + 2020;

				return {
					firstName: faker.name.firstName(),
					lastName: faker.name.lastName(),
					email: faker.internet.email(),
					password: null,
					gradYear,
					picture: faker.internet.avatar(),
					isFaculty: Boolean(Math.floor(Math.random() * 2)),
					active: true,
					createdAt: now,
					updatedAt: now
				};
			});

		await queryInterface.bulkInsert('users', users, {});
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
