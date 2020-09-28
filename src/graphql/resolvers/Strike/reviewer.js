export default (strike, args, { models }) => {
	return models.users.reviewerIdLoader.load(strike.reviewerId);
};
