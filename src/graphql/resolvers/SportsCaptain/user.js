export default (sportsCaptain, args, { models }) => {
	return models.users.idLoader.load(sportsCaptain.userId);
};
