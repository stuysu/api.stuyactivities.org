export default (org, args, context) => {
	return context.models.meetings.orgIdLoader.load(org.id);
};
