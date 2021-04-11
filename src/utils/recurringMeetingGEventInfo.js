import urlJoin from 'url-join';
import { PUBLIC_URL } from '../constants';

export default ({
	title,
	description,
	start,
	end,
	frequency,
	orgName,
	orgUrl
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
	realStart.setDate(newDate);
	realEnd.setDate(newDate);

	realStart.setHours(start.getHours());
	realStart.setMinutes(start.getMinutes());
	realEnd.setHours(end.getHours());
	realEnd.setMinutes(end.getMinutes());

	const renderedDescription = markdownIt.render(description);

	return {
		name: title,
		description: renderedDescription,
		start: realEnd.toISOString(),
		end: realEnd.toISOString(),
		source: {
			title: `Recurring Meeting by ${orgName} | StuyActivities`,
			url: urlJoin(PUBLIC_URL, org.url, 'meetings')
		},
		// https://tools.ietf.org/html/rfc5545#section-3.8.5 - can set EXDATEs, TODO
		recurrence: [`RRULE:FREQ=WEEKLY;INTERVAL=${frequency}`]
	};
};
