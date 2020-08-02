export default (edit, args, { models }) => {
	return models.organizations.idLoader.load(edit.organizationId);
};
