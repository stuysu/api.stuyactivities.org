module.exports = {
	meetingDays: charter => JSON.parse(charter.meetingDays || '[]'),
	organization: charter => charter.getOrganization()
};
