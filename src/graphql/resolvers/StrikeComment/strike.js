export default (message, args, { models }) => {
	return models.strikes.strikeIdLoader.load(message.strikeId);
};
