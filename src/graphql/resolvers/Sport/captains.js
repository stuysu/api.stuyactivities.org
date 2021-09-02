export default (sport, args, { models }) => {
	return models.sportsCaptains.sportIdLoader.load(sport.id);
};