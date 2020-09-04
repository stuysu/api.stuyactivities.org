import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';

import uploadPicStream from '../../../utils/uploadPicStream';
import charterValidator from '../../../utils/charterValidator';
import cryptoRandomString from 'crypto-random-string';

import { EDITABLE_CHARTER_FIELDS } from '../../../constants';

const cloudinary = require('cloudinary').v2;

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

	let { charter, orgId, force } = args;

	session.authenticationRequired(['alterCharter']);

	const org = await organizations.findOne({ where: { id: orgId } });
	if (!org) {
		throw new ApolloError(
			'Could not find an organization with that url or id',
			'ID_NOT_FOUND'
		);
	}
	await session.orgAdminRequired(org.id, ['alterCharter']);

	// NEXT STEP CHECK WHICH FIELDS WERE CHANGED
	const alteredFields = EDITABLE_CHARTER_FIELDS.filter(
		field =>
			typeof charter[field] !== 'undefined' && charter[field] !== null
	);

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
			organizationId: org.id,
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
			const conflictEditAlteredFields = charterEdit.getAlteredFields();

			const conflictingFields = alteredFields.filter(
				field =>
					charterEdit[field] !== null &&
					typeof charterEdit[field] !== 'undefined'
			);

			// Reject the whole charter edit
			if (conflictEditAlteredFields.length === conflictingFields.length) {
				charterEdit.status = 'rejected';
				charterEdit.reviewerId = session.userId;
				await charterEdit.save();
			} else {
				// Separate the conflicting fields into their own charter edit
				const newObj = {
					organizationId: charterEdit.organizationId,
					createdAt: charterEdit.createdAt,
					submittingUserId: charterEdit.submittingUserId,
					reviewerId: session.userId,
					status: 'rejected'
				};

				conflictingFields.forEach(field => {
					newObj[field] = charterEdit[field];
					charterEdit[field] = null;
				});

				await charterEdit.save();
				await charterEdits.create(newObj);
			}
		}

		await charterApprovalMessages.create({
			userId: session.userId,
			organizationId: org.id,
			message: 'User rejected pending changes and proposed new ones.',
			auto: true
		});
	}

	// Now that the fields in the charter have been validated and the conflicts have been resolved, we can now submit the new proposal changes
	const newEdits = {
		organizationId: org.id,
		submittingUserId: session.userId,
		status: 'pending'
	};

	if (charter.picture) {
		const randomName = cryptoRandomString({ length: 8 });
		const publicId = `organizations/${org.url}/${randomName}`;

		const pic = await uploadPicStream(charter.picture, publicId);
		const options = {
			quality: 90,
			secure: true
		};

		if (pic.width > pic.height) {
			options.width = 600;
		} else {
			options.height = 600;
		}

		charter.picture = cloudinary.url(pic.public_id, options);
	}

	alteredFields.forEach(field => {
		newEdits[field] = charter[field];
	});

	return charterEdits.create(newEdits);
};
