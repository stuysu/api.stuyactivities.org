import { ApolloError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId, title, description, status, honeybadgerId, path },
	{ authenticationRequired, adminRoleRequired, models: { helpRequests } }
) => {
	authenticationRequired();

	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	adminRoleRequired('helpRequests');

	if (title) {
		request.title = title;
	}

	if (description) {
		request.description = description;
	}

	if (status) {
		request.status = status;
	}

	if (honeybadgerId) {
		request.honeybadgerId = honeybadgerId;
	}

	if (path) {
		request.path = path;
	}

	await request.save();

	return request;
};
