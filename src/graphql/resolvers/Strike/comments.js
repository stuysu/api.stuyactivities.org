export default (strike, args, { models }) => {
	return models.strikecomments.strikeIdLoader.load(strike.id);
};
