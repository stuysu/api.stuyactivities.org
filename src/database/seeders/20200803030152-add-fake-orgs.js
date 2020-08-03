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

		const orgProps = Array(90)
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

		const getMeetingDays = () => {
			let meetingDays = days.filter(() => Math.random() < 0.5);
			if (!meetingDays.length) {
				meetingDays = ['monday'];
			}
		};

		const getBigField = () => {
			const numWords = Math.floor(Math.random() * 50) + 175;
			return faker.random.words(numWords);
		};

		const getCommitmentLevel = () =>
			commitmentLevels[
				Math.floor(Math.random() * commitmentLevels.length)
			];

		const charterProps = dbOrgs.map(org => {
			return {
				organizationId: org.id,
				picture: faker.image.city(),
				mission: faker.random.words(10),
				purpose: org.active ? getBigField() : null,
				benefit: org.active ? getBigField() : null,
				appointmentProcedures: org.active ? getBigField() : null,
				uniqueness: org.active ? getBigField() : null,
				meetingSchedule: org.active ? faker.random.words(15) : null,
				meetingDays: JSON.stringify(getMeetingDays()),
				commitmentLevel: getCommitmentLevel(),
				keywords: JSON.stringify(faker.random.words(3).split(' ')),
				extra: Math.random() < 0.5 ? faker.random.words(50) : null,
				createdAt: now,
				updatedAt: now
			};
		});

		await queryInterface.bulkInsert('charters', charterProps);

		const dbUsers = await queryInterface.sequelize.query(
			'SELECT * FROM users',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const adminMemberProps = [];

		const orgAdminMap = {};

		dbOrgs.forEach(org => {
			orgAdminMap[org.id] = [];

			const numAdmins = Math.floor(Math.random() * 3) + 1;
			for (let i = 0; i < numAdmins; i++) {
				const user =
					dbUsers[Math.floor(Math.random() * dbUsers.length)];
				adminMemberProps.push({
					organizationId: org.id,
					userId: user.id,
					role: faker.name.jobDescriptor(),
					adminPrivileges: true,
					createdAt: now,
					updatedAt: now
				});
				orgAdminMap[org.id].push(user);
			}
		});

		const approvalMessageProps = [];

		await queryInterface.bulkInsert('memberships', adminMemberProps);

		const charterEditProps = dbOrgs
			.map((org, index) => {
				// If the org is already active then charter edits aren't necessary
				if (org.active && Math.random() < 0.5) {
					return null;
				}

				const shouldUpdateField = field =>
					!charterProps[index][field] || Math.random() < 0.4;

				const submittingUser =
					orgAdminMap[org.id][
						Math.floor(Math.random() * orgAdminMap[org.id].length)
					];

				approvalMessageProps.push({
					organizationId: org.id,
					userId: submittingUser.id,
					message: 'Proposed Changes to the charter',
					auto: true,
					seen: false,
					createdAt: now,
					updatedAt: now
				});

				return {
					organizationId: org.id,
					submittingUserId: submittingUser.id,
					picture: shouldUpdateField('picture')
						? faker.image.city()
						: null,
					mission: shouldUpdateField('mission')
						? faker.random.words(10)
						: null,
					purpose: shouldUpdateField('purpose')
						? getBigField()
						: null,
					benefit: shouldUpdateField('benefit')
						? getBigField()
						: null,
					appointmentProcedures: shouldUpdateField(
						'appointmentProcedures'
					)
						? getBigField()
						: null,
					uniqueness: shouldUpdateField('uniqueness')
						? getBigField()
						: null,
					meetingSchedule: shouldUpdateField('meetingSchedule')
						? getBigField()
						: null,
					meetingDays: shouldUpdateField('meetingDays')
						? JSON.stringify(getMeetingDays())
						: null,
					commitmentLevel: shouldUpdateField('commitmentLevel')
						? getCommitmentLevel()
						: null,
					keywords: shouldUpdateField('keywords')
						? JSON.stringify(faker.random.words(3).split(' '))
						: null,
					extra: shouldUpdateField('extra') ? getBigField() : null,
					status: 'pending',
					reviewerId: null,
					createdAt: now,
					updatedAt: now
				};
			})
			.filter(Boolean);

		await queryInterface.bulkInsert(
			'charterApprovalMessages',
			approvalMessageProps
		);

		await queryInterface.bulkInsert('charterEdits', charterEditProps);
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
