export default async (org, args, context) => {
	const recurringMeetings = await context.models.recurringMeetings.orgIdLoader.load(
		org.id
	);
	//graphql-iso-date refuses to take milliseconds for its Time datatype,
	//but sequelize stores TIME data in milliseconds.
	//fun :)
	return recurringMeetings.map(recurringMeeting => {
		recurringMeeting.start = new Date(recurringMeeting.start);
		recurringMeeting.end = new Date(recurringMeeting.end);
		return recurringMeeting;
	});
};
