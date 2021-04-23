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

	async function sendEmails() {
		for (let i = 0; i < clubLeaders.length; i++) {
			const user = clubLeaders[i];

			await transport.sendMail({
				to: user.email, // list of receivers
				subject, // Subject line
				html: body
			});
		}
	}

	// We wrapped it in an async function so as not to wait for it to complete
	sendEmails();

	return true;
};
