export default (org, args, { models }) => {
	return models.charterApprovalMessages.orgIdLoader.load(org.id);
};
