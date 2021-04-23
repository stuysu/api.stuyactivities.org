import { getTransporter } from '../../../utils/sendEmail';

export default async (
	_,
	{ subject, body, sendToFaculty },
	{ session, models: { users, memberships, organizations } }
) => {
	await session.adminRoleRequired('charters');

	const transport = await getTransporter();

	const where = {};
	if (!sendToFaculty) {
		where.isFaculty = false;
	}

	const clubLeaders = await users.findAll({
		where,
		include: {
			model: memberships,
			where: {
				adminPrivileges: true
			},
			include: {
				model: organizations,
				where: {
					active: true
				}
			}
		}
	});

	const emails = clubLeaders.map(user =>
		transport.sendMail({
			from: 'StuyActivities <app@stuyactivities.org>', // sender address
			to: user.email, // list of receivers
			subject, // Subject line
			html: body
		})
	);

	await Promise.all(emails);

	return true;
};
