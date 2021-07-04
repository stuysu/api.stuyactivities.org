import sendEmail from '../../../utils/sendEmail';
import { Op } from 'sequelize';
import sanitizeHtml from '../../../utils/sanitizeHtml';

export default async (
	root,
	{ orgId, title, content, type, notifyMembers, notifyFaculty, localPinned },
	{ orgAdminRequired, models, user }
) => {
	orgAdminRequired(orgId);

	content = sanitizeHtml(content);

	const update = await models.updates.create({
		organizationId: orgId,
		submittingUserId: user.id,
		title,
		content,
		type,
		approval: 'approved',
		localPinned,
		globalPinned: false
	});

	const organization = await models.organizations.idLoader.load(orgId);

	if (notifyFaculty || notifyMembers) {
		const notifyAll = notifyMembers && notifyFaculty;
		const where = {};
		if (!notifyAll) {
			where.isFaculty = false;
		}

		const recipients = await models.users.findAll({
			where,
			include: {
				model: models.memberships,
				where: {
					organizationId: orgId,
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
				variables: { update, content }
			});
		});
	}

	return update;
};
