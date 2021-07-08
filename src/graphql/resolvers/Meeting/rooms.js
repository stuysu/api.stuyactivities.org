export default (meeting, _, { models: { rooms } }) =>
	rooms.meetingIdLoader.load(meeting.id);
