export default (charter, args, { models }) =>
	charter.picture
		? models.cloudinaryResources.idLoader.load(charter.picture)
		: null;
