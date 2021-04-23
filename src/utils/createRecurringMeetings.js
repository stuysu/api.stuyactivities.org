import { Op } from 'sequelize';
import moment from 'moment-timezone';
const {
	meetings,
	recurringMeetings,
	users,
	memberships,
	organizations
} = require('../database');
import sendEmail from './sendEmail';
const markdownIt = require('markdown-it')({ html: false, linkify: true });
//1 hour
const interval = 3600000;
const routine = async () => {
	// there might be a better way to do this with sequelize but I didn't find a good one
	(await recurringMeetings.findAll()).forEach(async recurringMeeting => {
		// 604800000 = number of milliseconds in a week
		const weeks = 604800000 * recurringMeeting.frequency;
		if (
			!recurringMeeting.lastCreated ||
			recurringMeeting.lastCreated.getTime() < Date.now() - weeks
		) {
			const start = new Date();
			const end = new Date();
			const rcStart = new Date(recurringMeeting.start);
			const rcEnd = new Date(recurringMeeting.end);
			start.setHours(rcStart.getHours());
			start.setMinutes(rcStart.getMinutes());
			end.setHours(rcEnd.getHours());
			end.setMinutes(rcEnd.getMinutes());
			let newDate = -1;
			if (start.getDay() > recurringMeeting.dayOfWeek) {
				//meeting will be next week
				newDate =
					start.getDate() +
					7 -
					(start.getDay() - recurringMeeting.dayOfWeek);
			} else {
				newDate =
					start.getDate() +
					(recurringMeeting.dayOfWeek - start.getDay());
			}
			// it is after the meeting, go to next week
			if (
				new Date().getHours() > start.getHours() ||
				(new Date().getHours() == start.getHours() &&
					new Date().getMinutes() > start.getMinutes())
			)
				newDate += 7;
			start.setDate(newDate);
			end.setDate(newDate);
			const meeting = await meetings.create({
				organizationId: recurringMeeting.organizationId,
				title: recurringMeeting.title,
				description: recurringMeeting.description,
				privacy: recurringMeeting.privacy,
				start,
				end
			});
			const members = await users.findAll({
				where: {
					isFaculty: false
				},
				include: {
					model: memberships,
					where: {
						organizationId: recurringMeeting.organizationId,
						updateNotification: {
							[Op.not]: false
						}
					},
					required: true
				}
			});

			const formattedStart = moment(start)
				.tz('America/New_York')
				.format('dddd, MMMM Do YYYY, h:mm a');

			const formattedEnd = moment(end)
				.tz('America/New_York')
				.format('dddd, MMMM Do YYYY, h:mm a');

			const renderedDescription = markdownIt.render(
				recurringMeeting.description
			);

			const org = organizations.idLoader.load(
				recurringMeeting.organizationId
			);
			for (let i = 0; i < members.length; i++) {
				const member = members[i];

				await sendEmail({
					to: member.email,
					subject: `${org.name} scheduled a meeting | StuyActivities`,
					template: 'meetingNotification.html',
					variables: {
						member,
						org,
						meeting,
						formattedStart,
						formattedEnd,
						renderedDescription
					}
				});
			}
			recurringMeeting.lastCreated = new Date();
			await recurringMeeting.save();
		}
	});
	setTimeout(routine, interval);
};

if (!process.env.CI) {
	routine();
}
