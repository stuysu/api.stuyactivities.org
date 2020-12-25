export default (charter, args, { models }) =>
	models.cloudinaryResources.idLoader.load(charter.picture);
