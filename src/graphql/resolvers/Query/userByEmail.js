import { ForbiddenError } from 'apollo-server-express';

export default (query, { email }, { models, session }) => {
	session.authenticationRequired(['userByEmail']);

	return models.users.findOne({ where: { email } });
};
