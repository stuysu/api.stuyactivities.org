export default (org, args, { models: { meetings } }) => {
	return meetings.orgIdUpcomingLoader.load(org.id);
};
