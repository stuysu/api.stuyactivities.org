export default edit => {
	return edit.organization || edit.getOrganization();
};
