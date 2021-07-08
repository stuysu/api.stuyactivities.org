import urlJoin from 'url-join';
import { PUBLIC_URL } from '../constants';
const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default ({
	title,
	description,
	start,
	end,
	frequency,
	orgName,
	orgUrl,
	dayOfWeek
}) => {
	const realStart = new Date();
	const realEnd = new Date();
	//assumes meetings start/end on the same day!!
	let newDate = -1;
	if (realStart.getDay() > dayOfWeek) {
		//first meeting will be next week
		newDate = realStart.getDate() + 7 - (realStart.getDay() - dayOfWeek);
	} else {
		newDate = realStart.getDate() + (dayOfWeek - realStart.getDay());
	}
	// it is after the meeting, go to next week
	if (
		new Date().getHours() > realStart.getHours() ||
		(new Date().getHours() == realStart.getHours() &&
			new Date().getMinutes() > realStart.getMinutes())
	)
		newDate += 7;
	realStart.setDate(newDate);
	realEnd.setDate(newDate);

	const rcStart = new Date(start);
	const rcEnd = new Date(end);
	realStart.setHours(rcStart.getHours());
	realStart.setMinutes(rcStart.getMinutes());
	realEnd.setHours(rcEnd.getHours());
	realEnd.setMinutes(rcEnd.getMinutes());

	const renderedDescription = markdownIt.render(description);

	return {
		name: title,
		description: renderedDescription,
		start: realStart.toISOString(),
		end: realEnd.toISOString(),
		source: {
			title: `Recurring Meeting by ${orgName} | StuyActivities`,
			url: urlJoin(PUBLIC_URL, orgUrl, 'meetings')
		},
		// https://tools.ietf.org/html/rfc5545#section-3.8.5 - can set EXDATEs, TODO
		recurrence: [`RRULE:FREQ=WEEKLY;INTERVAL=${frequency}`]
	};
};
