import { ApolloError, UserInputError } from 'apollo-server-express';
import { EDITABLE_CHARTER_FIELDS } from '../../../constants';

export default async (root, { fields, charterEditId }, { models, session }) => {
	session.authenticationRequired('rejectCharterFields');
	await session.adminRoleRequired('charters', ['rejectCharterFields']);

	const charterEdit = await models.charterEdits.idLoader.load(charterEditId);

	if (!charterEdit) {
		throw new ApolloError(
			'There is no charter edit with that id.',
			'CHARTER_EDIT_NOT_FOUND'
		);
	}

	// Remove duplicates and fields that don't exist
	fields = [...new Set(fields)];

	fields.forEach(field => {
		if (!EDITABLE_CHARTER_FIELDS.includes(field)) {
			throw new UserInputError(
				`One or more fields provided do not exist: ${field}`,
				{ invalidArgs: ['fields'] }
			);
		}
	});

	const approvedEdits = await charterEdit.approveFields(
		fields,
		session.userId
	);

	const charter = await models.charters.orgIdLoader.load(
		approvedEdits.organizationId
	);

	const alteredFields = approvedEdits.getAlteredFields();

	alteredFields.forEach(field => {
		charter[field] = approvedEdits[field];
	});
	await charter.save();

	const org = await models.organizations.idLoader.load(
		approvedEdits.organizationId
	);

	// This org has fulfilled the charter req and we can now make their charter public
	if (!org.active) {
		const canBeActive = EDITABLE_CHARTER_FIELDS.every(
			field =>
				typeof charter[field] !== 'undefined' && charter[field] !== null
		);

		if (canBeActive) {
			org.active = true;
			await org.save();
		}
	}

	return approvedEdits;
};
