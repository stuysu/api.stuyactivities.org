export default (sportsCaptain, args, { models }) => {
	return models.sports.idLoader.load(sportsCaptain.sportId);
};