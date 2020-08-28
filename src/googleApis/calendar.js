import { google } from 'googleapis';
import oAuth2Client from './oAuth2Client';
const {
	organizations,
	googleCalendars,
	memberships,
	users
} = require('./../database');

const CalendarApi = google.calendar({ version: 'v3', auth: oAuth2Client });

// Checks if an organization has an associated google calendar
// If not, then it creates one and then adds the club admins as editors and members as viewers
export const initOrgCalendar = async orgId => {
	const exists = await googleCalendars.orgIdLoader.load(orgId);

	if (exists) {
		return exists;
	}

	const org = await organizations.idLoader.load(orgId);

	if (!org) {
		throw new Error(
			'Attempted to create a calendar for a nonexistent organization.'
		);
	}

	if (!org.active) {
		throw new Error(
			'Attempted to create a calendar for an unapproved organization.'
		);
	}

	const gCal = await createCalendar(org.name);

	const gCalId = gCal.id;

	let cal = await googleCalendars.create({
		organizationId: org.id,
		gCalId
	});

	const memberships = await memberships.orgIdLoader.load(orgId);

	// using dataloaders to keep things efficient if ever needed in a N+1 query
	const members = await Promise.all(
		memberships.map(async mem => ({
			membership: mem,
			user: await users.idLoader.load(mem.userId)
		}))
	);

	// Insert all of the user permissions
	await Promise.all(
		members.map(member =>
			shareCalendar(gCalId, member.user.email, 'reader')
		)
	);

	return cal;
};

export function createCalendar(name, timeZone) {
	return CalendarApi.calendars.insert({
		resource: {
			summary: name,
			timeZone
		}
	});
}

export function shareCalendar(calendarId, email, role) {
	return CalendarApi.acl.insert({
		calendarId,
		sendNotifications: true,
		resource: {
			role,
			scope: {
				type: 'user',
				value: email
			}
		}
	});
}

export function alterCalendarRole(
	calendarId,
	email,
	role,
	sendNotifications = false
) {
	return CalendarApi.acl.update({
		calendarId,
		sendNotifications,
		ruleId: `user:${email}`,
		resource: {
			scope: {
				type: 'user',
				value: email
			},
			role
		}
	});
}

export function removeCalendarAccess(calendarId, email) {
	return CalendarApi.acl.delete({
		calendarId,
		ruleId: `user:${email}`
	});
}

export function createCalendarEvent(
	calendarId,
	{
		name,
		description,
		start,
		end,
		location,
		source: { title, url },
		reminders: { useDefault = true },
		sendUpdates = 'all'
	}
) {
	return CalendarApi.events.insert({
		calendarId,
		conferenceDataVersion: 1,
		sendUpdates,
		resource: {
			end: {
				dateTime: end
			},
			start: {
				dateTime: start
			},
			summary: name,
			reminders: {
				useDefault
			},
			description,
			source: {
				title,
				url
			},
			location,
			attendees: [
				{
					email: calendarId,
					resource: true
				}
			]
		}
	});
}

export function alterCalendarEvent(
	calendarId,
	eventId,
	{
		name,
		description,
		start,
		end,
		location,
		source: { title, url },
		reminders: { useDefault = true },
		sendUpdates = 'all'
	}
) {
	return CalendarApi.events.update({
		calendarId,
		eventId,
		conferenceDataVersion: 1,
		sendUpdates,
		resource: {
			end: {
				dateTime: end
			},
			start: {
				dateTime: start
			},
			summary: name,
			reminders: {
				useDefault
			},
			description,
			source: {
				title,
				url
			},
			location,
			attendees: [
				{
					email: calendarId,
					resource: true
				}
			]
		}
	});
}

export function deleteCalendarEvent(calendarId, eventId, sendUpdates = 'all') {
	return CalendarApi.events.delete({
		calendarId,
		eventId
	});
}

export default CalendarApi;
