import { ApolloError, UserInputError } from 'apollo-server-express';
import sendEmail from '../../../utils/sendEmail';

export default async (
	root,
	{ fields, charterEditId },
	{
		models: { charterEdits, charterApprovalMessages, memberships, users },
		adminRoleRequired,
		user
	}
) => {
	adminRoleRequired('charters');

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
		userId: user.id,
		message: `Rejected the following fields: ${fields.join(', ')}`,
		auto: true,
		seen: false
	});

	let rejectedEdit;

	if (fields.length === alteredFields.length) {
		charterEdit.status = 'rejected';
		charterEdit.reviewerId = user.id;
		await charterEdit.save();

		rejectedEdit = charterEdit;
	} else {
		// move over the approved fields to a new charter edit
		const newObj = {
			organizationId: charterEdit.organizationId,
			createdAt: charterEdit.createdAt,
			submittingUserId: charterEdit.submittingUserId,
			reviewerId: user.id,
			status: 'rejected'
		};

		fields.forEach(field => {
			newObj[field] = charterEdit[field];
			charterEdit[field] = null;
		});

		await charterEdit.save();

		rejectedEdit = await charterEdits.create(newObj);
	}

	const members = await memberships.findAll({
		where: {
			organizationId: charterEdit.organizationId,
			adminPrivileges: true
		},
		include: {
			model: users
		}
	});

	const org = await charterEdit.getOrganization();

	members.forEach(member => {
		sendEmail({
			to: member.user.email,
			subject: `${org.name} Charter Edits Needed | StuyActivities`,
			template: 'charterFieldDenied.html',
			variables: {
				org,
				user: member.user
			}
		});
	});

	return rejectedEdit;
};
