export default (org, args, context) => {
	return context.models.recurringMeetings.orgIdLoader.load(org.id);
};
