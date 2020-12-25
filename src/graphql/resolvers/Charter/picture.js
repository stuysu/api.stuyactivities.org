export default (charter, args, { models }) => {
	return models.cloudinaryResources.idLoader.load(charter.picture);
};
