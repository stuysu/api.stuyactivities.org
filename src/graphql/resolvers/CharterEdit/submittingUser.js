module.exports = edit => {
	return edit.submittingUser || edit.getSubmittingUser();
};
