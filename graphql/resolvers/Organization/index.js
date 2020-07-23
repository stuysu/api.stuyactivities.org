module.exports = {
	tags: org => org.getTags(),
	charter: org => org.charter || org.getCharter()
};
