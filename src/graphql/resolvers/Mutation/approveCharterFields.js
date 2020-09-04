import { ApolloError, UserInputError } from 'apollo-server-express';
import { EDITABLE_CHARTER_FIELDS } from '../../../constants';
import { initOrgCalendar } from '../../../googleApis/calendar';

export default async (root, { fields, charterEditId }, { models, session }) => {
	session.authenticationRequired('rejectCharterFields');
	await session.adminRoleRequired('charters', ['rejectCharterFields']);

	const charterEdit = await models.charterEdits.idLoader.load(charterEditId);

	if (!charterEdit) {
		throw new ApolloError(
			'There is no charter edit with that id.',
			'ID_NOT_FOUND'
		);
	}

	const alteredFields = charterEdit.getAlteredFields();

	// Remove duplicates and fields that don't exist
	fields = Array.from(new Set(fields));

	fields.forEach(field => {
		if (!alteredFields.includes(field)) {
			throw new UserInputError(
				`One or more fields is not valid for this edit: ${field}`,
				{ invalidArgs: ['fields'] }
			);
		}
	});

	let approvedEdit;

	if (alteredFields.length === fields.length) {
		// approve the current charter edit
		charterEdit.status = 'approved';
		charterEdit.reviewerId = session.userId;
		await charterEdit.save();
		approvedEdit = charterEdit;
	} else {
		// move over the approved fields to a new charter edit
		const newObj = {
			organizationId: charterEdit.organizationId,
			createdAt: charterEdit.createdAt,
			submittingUserId: charterEdit.submittingUserId,
			reviewerId: session.userId,
			status: 'approved'
		};

		fields.forEach(field => {
			newObj[field] = charterEdit[field];
			charterEdit[field] = null;
		});

		await charterEdit.save();

		approvedEdit = await models.charterEdits.create(newObj);
	}

	const charter = await models.charters.orgIdLoader.load(
		charterEdit.organizationId
	);

	fields.forEach(field => {
		charter[field] = approvedEdit[field];
	});

	await charter.save();

	const org = await models.organizations.idLoader.load(
		charter.organizationId
	);

	// This org has fulfilled the charter req and we can now make their charter public
	if (!org.active) {
		const canBeActive = EDITABLE_CHARTER_FIELDS.every(
			field =>
				(typeof charter[field] !== 'undefined' &&
					charter[field] !== null) ||
				field === 'extra'
		);

		if (canBeActive) {
			org.active = true;
			await org.save();
			await initOrgCalendar(org.id);
		}
	}

	return approvedEdit;
};
