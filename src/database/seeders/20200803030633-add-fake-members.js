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

		const orgMembersMap = {};

		const dbMemberships = await queryInterface.sequelize.query(
			'SELECT * FROM memberships',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		dbMemberships.forEach(member => {
			if (!orgMembersMap[member.organizationId]) {
				orgMembersMap[member.organizationId] = [];
			}

			orgMembersMap[member.organizationId].push(member);
		});

		const dbUsers = await queryInterface.sequelize.query(
			'SELECT * FROM users',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const dbOrgs = await queryInterface.sequelize.query(
			'SELECT * FROM organizations',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const now = new Date();
		const newMemberProps = [];
		const newMemberRequestProps = [];

		const getUserMessage = () => {
			if (Math.random() < 0.3) {
				return null;
			}
			return faker.random.words(15);
		};

		dbOrgs.forEach(org => {
			const numNewMembers = Math.floor(Math.random() * 35);
			let numMembersAdded = 0;
			while (numMembersAdded < numNewMembers) {
				const user =
					dbUsers[Math.floor(Math.random() * dbUsers.length)];

				const memberExists = orgMembersMap[org.id].some(
					member => member.userId === user.id
				);

				if (!memberExists) {
					orgMembersMap[org.id].push(user);
					numMembersAdded++;

					const hasBeenApproved = Math.random() < 0.7;
					if (hasBeenApproved) {
						newMemberProps.push({
							organizationId: org.id,
							userId: user.id,
							role: faker.name.jobDescriptor(),
							adminPrivileges: Math.random() < 0.2,
							createdAt: now,
							updatedAt: now
						});
					} else {
						const isAdmin = Math.random() < 0.3;

						newMemberRequestProps.push({
							organizationId: org.id,
							userId: user.id,
							role: faker.name.jobDescriptor(),
							adminPrivileges: isAdmin,
							userMessage: isAdmin ? null : getUserMessage(),
							adminMessage: isAdmin ? getUserMessage() : null,
							userApproval: !isAdmin,
							adminApproval: isAdmin,
							createdAt: now,
							updatedAt: now
						});
					}
				}
			}
		});

		await queryInterface.bulkInsert('memberships', newMemberProps);
		await queryInterface.bulkInsert(
			'membershipRequests',
			newMemberRequestProps
		);
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
