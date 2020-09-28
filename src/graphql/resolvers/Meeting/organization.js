export default (meeting, args, { models }) => {
	return models.organizations.idLoader.load(meeting.organizationId);
};
