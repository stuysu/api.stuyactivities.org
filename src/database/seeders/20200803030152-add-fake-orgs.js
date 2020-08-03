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

		const orgProps = Array(30)
			.fill(0)
			.map(() => {
				return {
					name: faker.company.companyName(),
					url: faker.company.bsBuzz(),
					active: Math.random() < 0.5,
					createdAt: now,
					updatedAt: now
				};
			});

		await queryInterface.bulkInsert('organizations', orgProps);

		const dbOrgs = await queryInterface.sequelize.query(
			'SELECT * FROM organizations',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

		const commitmentLevels = ['low', 'medium', 'high'];

		const charterProps = dbOrgs.map(org => {
			return {
				organizationId: org.id,
				picture: faker.image.city(),
				mission: faker.random.words(10),
				purpose: org.active ? faker.random.words(175) : null,
				benefit: org.active ? faker.random.words(175) : null,
				appointmentProcedures: org.active
					? faker.random.words(175)
					: null,
				uniqueness: org.active ? faker.random.words(175) : null,
				meetingSchedule: org.active ? faker.random.words(15) : null,
				meetingDays: JSON.stringify(
					days.filter(() => Math.random() < 0.5)
				),
				commitmentLevel:
					commitmentLevels.find(() => Math.random() < 0.5) || 'low',
				keywords: JSON.stringify(faker.random.words(3).split(' ')),
				extra: Math.random() < 0.5 ? faker.random.words(50) : null,
				createdAt: now,
				updatedAt: now
			};
		});

		await queryInterface.bulkInsert('charters', charterProps);
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
