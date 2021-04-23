export default async ({ meetings, recurringMeeting }) => {
	//Find meetings that were created by recurring meeting
	//Might catch other meetings but don't see that happening often enough for it to be an issue
	//Because it only catches meetings exactly like the ones created by the recurring meeting
	const possibleMeetings = await meetings.findAll({
		where: {
			title: recurringMeeting.title,
			description: recurringMeeting.description,
			privacy: recurringMeeting.privacy
		}
	});

	const rcStart = new Date(recurringMeeting.start);
	const rcEnd = new Date(recurringMeeting.end);

	for (const meeting of possibleMeetings) {
		if (
			meeting.start.getHours() === rcStart.getHours() &&
			meeting.start.getMinutes() === rcStart.getMinutes() &&
			meeting.end.getHours() === rcEnd.getHours() &&
			meeting.end.getMinutes() === rcEnd.getMinutes()
		) {
			await meeting.destroy();
		}
	}
};
