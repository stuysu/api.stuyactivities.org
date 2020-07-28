module.exports = {
	tags: org => org.tags || org.getTags(),
	charter: org => org.charter || org.getCharter(),
	memberships: org => org.memberships || org.getMemberships()
};
