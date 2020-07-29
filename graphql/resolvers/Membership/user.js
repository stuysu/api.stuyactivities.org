module.exports = membership => {
	if (membership.user) {
		return membership.user;
	}

	return membership.getUser();
};
