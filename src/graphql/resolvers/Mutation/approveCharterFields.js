import { ApolloError, UserInputError } from 'apollo-server-express';
import {
	EDITABLE_CHARTER_FIELDS,
	OPTIONAL_CHARTER_FIELDS
} from '../../../constants.js';
import { initOrgCalendar } from '../../../googleApis/calendar';
import sendEmail from '../../../utils/sendEmail';

export default async (
	root,
	{ fields, charterEditId },
	{ models, adminRoleRequired, verifyMembershipCount, user }
) => {
	adminRoleRequired('charters');

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
		charterEdit.reviewerId = user.id;
		await charterEdit.save();
		approvedEdit = charterEdit;
	} else {
		// move over the approved fields to a new charter edit
		const newObj = {
			organizationId: charterEdit.organizationId,
			createdAt: charterEdit.createdAt,
			submittingUserId: charterEdit.submittingUserId,
			reviewerId: user.id,
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
				OPTIONAL_CHARTER_FIELDS.includes(field)
		);

		if (canBeActive) {
			org.active = true;
			await org.save();

			const settings = await models.settings.findOne({});

			verifyMembershipCount(org, settings);

			const members = await models.memberships.findAll({
				where: {
					organizationId: org.id,
					adminPrivileges: true
				},
				include: {
					model: models.users
				}
			});

			members.forEach(member => {
				sendEmail({
					to: member.user.email,
					subject: `${org.name} Approved | StuyActivities`,
					template: 'orgApproval.html',
					variables: {
						org,
						user: member.user,
						locked: org.locked === 'LOCK',
						requirement: settings.membershipRequirement
					}
				});
			});
			await initOrgCalendar(org.id);
		}
	}

	return approvedEdit;
};
