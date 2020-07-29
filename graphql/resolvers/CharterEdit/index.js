module.exports = {
	organization: edit => edit.getOrganization(),
	submittingUser: edit => edit.getSubmittingUser(),
	reviewer: edit => edit.getReviewer(),
	meetingDays: edit => JSON.parse(edit.meetingDays || '[]'),
	comments: edit => edit.getComments(),
	alteredFields: require('./alteredFields')
};
