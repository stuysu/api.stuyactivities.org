module.exports = {
	tags: org => org.getTags(),
	charter: org => org.getCharter(),
	picture: require('./picture')
};
