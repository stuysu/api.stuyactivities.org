import { ForbiddenError } from 'apollo-server-express';
import linkGoogle from './linkGoogle';

const allowedPlatforms = ['google'];
export default (
	parent,
	{ token, platform },
	{ authenticationRequired, user }
) => {
	authenticationRequired();

	if (!allowedPlatforms.includes(platform)) {
		throw new ForbiddenError(
			'That platform is not supported. The only supported platform right now is Google'
		);
	}

	if (platform === 'google') {
		return linkGoogle({ token, user });
	}
};
