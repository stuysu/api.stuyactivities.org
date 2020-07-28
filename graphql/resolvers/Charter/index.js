module.exports = {
	meetingDays: charter => JSON.parse(charter.meetingDays || '[]')
};
