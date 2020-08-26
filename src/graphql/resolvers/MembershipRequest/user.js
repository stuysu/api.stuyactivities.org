export default (request, args, { models }) => {
	return models.users.idLoader.load(request.userId);
};
