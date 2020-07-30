module.exports = edit => {
	return edit.organization || edit.getOrganization();
};
