export default (org, args, { models }) => {
	return models.strikes.orgIdLoader.load(org.id);
};
