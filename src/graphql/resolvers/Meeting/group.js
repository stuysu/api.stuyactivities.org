export default (meeting, _, { models: { groups } }) =>
	groups.idLoader.load(meeting.groupId);
