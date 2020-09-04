import { EDITABLE_CHARTER_FIELDS } from '../../../constants';
import { ApolloError, UserInputError } from 'apollo-server-express';

export default async (
	root,
	{ fields, charterEditId },
	{ models: { charterEdits, charterApprovalMessages }, session }
) => {
	session.authenticationRequired('rejectCharterFields');
	await session.adminRoleRequired('charters', ['rejectCharterFields']);

	const charterEdit = await charterEdits.idLoader.load(charterEditId);

	if (!charterEdit) {
		throw new ApolloError(
			'There is no charter edit with that id.',
			'ID_NOT_FOUND'
		);
	}

	// Remove duplicates and fields that don't exist
	fields = Array.from(new Set(fields));

	const alteredFields = charterEdit.getAlteredFields();

	fields.forEach(field => {
		if (!alteredFields.includes(field)) {
			throw new UserInputError(
				`One or more fields provided are not valid for this charter edit: ${field}`,
				{ invalidArgs: ['fields'] }
			);
		}
	});

	await charterApprovalMessages.create({
		organizationId: charterEdit.organizationId,
		userId: session.userId,
		message: `Rejected the following fields: ${fields.join(', ')}`,
		auto: true,
		seen: false
	});

	let rejectedEdit;

	if (fields.length === alteredFields.length) {
		charterEdit.status = 'rejected';
		charterEdit.reviewerId = session.userId;
		await charterEdit.save();

		rejectedEdit = charterEdit;
	} else {
		// move over the approved fields to a new charter edit
		const newObj = {
			organizationId: charterEdit.organizationId,
			createdAt: charterEdit.createdAt,
			submittingUserId: charterEdit.submittingUserId,
			reviewerId: session.userId,
			status: 'rejected'
		};

		fields.forEach(field => {
			newObj[field] = charterEdit[field];
			charterEdit[field] = null;
		});

		await charterEdit.save();

		rejectedEdit = await charterEdits.create(newObj);
	}

	return rejectedEdit;
};
