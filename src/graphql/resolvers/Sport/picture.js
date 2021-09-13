export default (sport, args, { models }) =>
	sport.picture
		? models.cloudinaryResources.idLoader.load(sport.picture)
		: null;
