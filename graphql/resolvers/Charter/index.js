module.exports = {
	meetingDays: charter => JSON.parse(charter.meetingDays || null),
	organization: charter => charter.getOrganization()
};
