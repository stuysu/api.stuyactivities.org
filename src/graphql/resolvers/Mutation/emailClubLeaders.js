import { getTransporter } from '../../../utils/sendEmail';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async (
	_,
	{ subject, body, sendToFaculty },
	{ adminRoleRequired, models: { users, memberships, organizations }, user }
) => {
	adminRoleRequired('charters');

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
			if (i % 20 === 0) {
				// for every 20 emails sleep 2 seconds to make sure the email server isn't overloaded
				await sleep(2000);
			}

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
