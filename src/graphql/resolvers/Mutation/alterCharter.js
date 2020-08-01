import {
	ApolloError,
	UserInputError,
	ForbiddenError
} from 'apollo-server-express';

import uploadPicStream from '../../../utils/uploadPicStream';
import charterValidator from '../../../utils/charterValidator';
import cryptoRandomString from 'crypto-random-string';

import { EDITABLE_CHARTER_FIELDS } from '../../../constants';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: {
			memberships,
			organizations,
			charterEdits,
			charterApprovalMessages,
			Sequelize: { Op }
		}
	} = context;

	let { charter, orgUrl, orgId, force } = args;

	session.authenticationRequired([]);

	if (!orgId && !orgUrl) {
		throw new UserInputError(
			'Either the organization url or its id must be passed in order to alter its charter',
			{
				invalidArgs: ['orgUrl', 'orgId']
			}
		);
	}

	let org;

	if (orgId) {
		org = await organizations.findOne({ where: { id: orgId } });
	} else if (orgUrl) {
		org = await organizations.findOne({ where: { url: orgUrl } });
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

	// NEXT STEP CHECK WHICH FIELDS WERE CHANGED
	const alteredFields = [];
	const nonAlteredFields = [];
	EDITABLE_CHARTER_FIELDS.forEach(field => {
		if (typeof charter[field] !== 'undefined' && charter[field] !== null) {
			alteredFields.push(field);
		} else {
			nonAlteredFields.push(field);
		}
	});

	if (charter.picture) {
		charter.picture = await charter.picture;
	}

	if (charter.meetingDays) {
		charter.meetingDays = [...new Set(charter.meetingDays)].map(i =>
			i.toLowerCase()
		);
	}

	if (charter.commitmentLevel) {
		charter.commitmentLevel = charter.commitmentLevel.toLowerCase();
	}

	if (charter.keywords) {
		charter.keywords = [...new Set(charter.keywords)]
			.filter(Boolean)
			.map(i => i.toLowerCase());
	}

	// VALIDATE THE PROPOSED CHANGES AND MAKE SURE THEY PASS REQUIREMENTS
	alteredFields.forEach(field => charterValidator(field, charter[field]));

	// CHECK TO MAKE SURE CHANGES DON'T CONFLICT WITH EXISTING PENDING CHANGES
	const notNullQueries = [];

	alteredFields.forEach(field => {
		notNullQueries.push({
			[field]: {
				[Op.not]: null
			}
		});
	});

	const pendingConflicts = await charterEdits.findAll({
		where: {
			status: 'pending',
			[Op.or]: notNullQueries
		}
	});

	if (pendingConflicts.length) {
		if (!force) {
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

			await charterApprovalMessages.create({
				userId: session.userId,
				organizationId: org.id,
				message: 'User rejected pending changes and proposed new ones.',
				auto: true
			});

			await charterEdit.save();

			if (Object.keys(nonConflictingValues).length) {
				// Create a new charterEdit with the fields that didn't conflict
				await charterEdits.create({
					...nonConflictingValues,
					submittingUserId: session.userId,
					status: 'pending',
					createdAt: charterEdit.createdAt
				});
			}
		}
	}

	// Now that the fields in the charter have been validated and the conflicts have been resolved, we can now submit the new proposal changes
	const newEdits = {
		submittingUserId: session.userId,
		status: 'pending'
	};

	if (charter.picture) {
		const randomName = cryptoRandomString({ length: 8 });
		const publicId = `/organizations/${org.url}/${randomName}`;

		const pic = await uploadPicStream(charter.picture, publicId);
		charter.picture = pic.secure_url;
	}

	alteredFields.forEach(field => {
		newEdits[field] = charter[field];
	});

	return charterEdits.create(newEdits);
};
