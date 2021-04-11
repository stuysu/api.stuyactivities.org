export default async ({ meetings, recurringMeeting }) => {
	//Find meetings that were created by recurring meeting
	//Might catch other meetings but don't see that happening often enough for it to be an issue
	//Because it only catches meetings exactly like the ones created by the recurring meeting
	const possibleMeetings = meetings.findAll({
		where: {
			title: recurringMeeting.title,
			description: recurringMeeting.description,
			privacy: reucrringMeeting.privacy
		}
	});

	for (const meeting of possibleMeetings) {
		if (
			meeting.start.getHours() === recurringMeeting.start.getHours() &&
			meeting.start.getMinutes() ===
				recurringMeeting.start.getMinutes() &&
			meeting.end.getHours() === recurringMeeting.end.getHours() &&
			meeting.end.getMinutes() === recurringMeeting.end.getMinutes()
		) {
			await meeting.destroy();
		}
	}
};
