export default (org, args, context) => {
	return context.models.groups.orgIdLoader.load(org.id);
};
