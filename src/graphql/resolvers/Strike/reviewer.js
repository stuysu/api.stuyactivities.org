export default (strike, args, { models }) => {
	return models.users.idLoader.load(strike.reviewerId);
};