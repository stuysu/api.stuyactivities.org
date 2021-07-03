import { UserInputError } from 'apollo-server-express';
import sanitizeHtml from '../../../utils/sanitizeHtml';
import { Op } from 'sequelize';
import sendEmail from '../../../utils/sendEmail';

export default async (
	_,
	{ id, title, content, type, notifyMembers, notifyFaculty, localPinned },
	{ orgAdminRequired, models, user }
) => {
	const update = await models.updates.findOne({ where: { id } });

	if (!update) {
		throw new UserInputError('There is no update with that id');
	}

	orgAdminRequired(update.organizationId);

	update.title = title;
	const safeContent = sanitizeHtml(content);

	update.content = safeContent;
	update.type = type;
	update.localPinned = localPinned;

	await update.save();

	const organization = await models.organizations.findOne({
		where: { id: update.organizationId }
	});

	if (notifyMembers) {
		const where = {};

		if (!notifyFaculty) {
			where.isFaculty = false;
		}

		const recipients = await models.users.findAll({
			where,
			include: {
				model: models.memberships,
				where: {
					organizationId: update.organizationId,
					updateNotification: {
						[Op.not]: false
					}
				},
				required: true
			}
		});

		recipients.forEach(member => {
			sendEmail({
				to: member.email,
				replyTo: user.email,
				template: 'updateNotification.html',
				subject: `${update.title} | ${organization.name}`,
				variables: { update, content: safeContent }
			});
		});
	}

	return update;
};
