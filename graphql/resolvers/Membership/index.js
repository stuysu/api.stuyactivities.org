module.exports = {
	user: membership => membership.user || membership.getUser()
};
