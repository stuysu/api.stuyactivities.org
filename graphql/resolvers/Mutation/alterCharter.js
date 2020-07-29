const {
	ApolloError,
	UserInputError,
	ForbiddenError
} = require('apollo-server-express');

const charterValidator = require('../../../utils/charterValidator');

const { EDITABLE_CHARTER_FIELDS } = require('./../../../constants');

module.exports = async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: {
			memberships,
			organizations,
			charterEdits,
			charterEditComments,
			Sequelize: { Op }
		}
	} = context;
	session.authenticationRequired([]);

	if (!args.orgId && !args.orgUrl) {
		throw new UserInputError(
			'Either the organization url or its id must be passed in order to alter its charter',
			{
				invalidArgs: ['orgUrl', 'orgId']
			}
		);
	}

	let org;

	if (args.orgId) {
		org = await organizations.findOne({ where: { id: args.orgId } });
	} else if (args.orgUrl) {
		org = await organizations.findOne({ where: { url: args.orgUrl } });
	}

	if (!org) {
		throw new ApolloError(
			'Could not find an organization with that url or id',
			'ORG_NOT_FOUND'
		);
	}

	const isAdmin = await memberships.findOne({
		where: {
			userId: session.userId,
			adminPrivileges: true,
			organizationId: org.id
		}
	});

	if (!isAdmin) {
		throw new ForbiddenError(
			'Only admins are allowed to propose changes to the charter'
		);
	}

	if (args.charter.picture) {
		args.charter.picture = await args.charter.picture;
	}

	// NEXT STEP CHECK WHICH FIELDS WERE CHANGED
	const alteredFields = [];
	const nonAlteredFields = [];
	EDITABLE_CHARTER_FIELDS.forEach(field => {
		if (args.charter[field] !== null) {
			alteredFields.push(field);
		} else {
			nonAlteredFields.push(field);
		}
	});

	// VALIDATE THE PROPOSED CHANGES AND MAKE SURE THEY PASS REQUIREMENTS
	alteredFields.forEach(field => {
		charterValidator(field, args.charter[field]);
	});

	// CHECK TO MAKE SURE CHANGES DON'T CONFLICT WITH EXISTING PENDING CHANGES
	const notNullChecks = [];

	alteredFields.forEach(field => {
		notNullChecks.push({
			[field]: {
				[Op.not]: null
			}
		});
	});

	const pendingConflicts = await charterEdits.findAll({
		where: {
			status: 'pending',
			[Op.or]: notNullChecks
		}
	});

	if (pendingConflicts.length) {
		if (!args.force) {
			// Throw an error
			throw new ApolloError(
				'You already have pending changes that conflict with the changes you are trying to make',
				'PENDING_CHANGE_CONFLICTS'
			);
		}

		// Reject the existing pending changes that conflict with this new request
		for (let x = 0; x < pendingConflicts.length; x++) {
			const charterEdit = pendingConflicts[x];
			const nonConflictingValues = {};

			nonAlteredFields.forEach(field => {
				const change = charterEdit[field];

				if (change !== null) {
					nonConflictingValues[field] = change;
				}

				charterEdit[field] = null;
			});

			charterEdit.status = 'rejected';
			charterEdit.reviewerId = session.userId;

			await charterEditComments.create({
				userId: session.userId,
				charterEditId: charterEdit.id,
				comment:
					'Automatic Comment: This user rejected the changes in this edit and proposed new ones.'
			});

			await charterEdit.save();

			// Create a new charterEdit with the fields that didn't conflict
			await charterEdits.create({
				...nonConflictingValues,
				submittingUserId: session.userId,
				status: 'pending',
				createdAt: charterEdit.createdAt
			});
		}
	}
};
