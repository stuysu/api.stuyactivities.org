import { ForbiddenError } from 'apollo-server-express';
import linkGoogle from './linkGoogle';

const allowedProviders = ['google'];
export default (parent, { token, provider }, { models, session }) => {
	session.authenticationRequired();

	if (!allowedProviders.includes(provider)) {
		throw new ForbiddenError(
			'That provider is not supported. The only supported provider right now is Google'
		);
	}

	if (provider === 'google') {
		return linkGoogle(token, session);
	}
};
