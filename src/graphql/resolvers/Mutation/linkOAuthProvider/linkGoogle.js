import resolveGoogleIdToken from '../../../../utils/resolveGoogleIdToken';
import { ApolloError, ForbiddenError } from 'apollo-server-express';

const { oAuthIds } = require('./../../../../database');

export default async (token, session) => {
	const userOAuths = await oAuthIds.userIdLoader.load(session.userId);

	const alreadyLinkedToGoogle = userOAuths.find(
		row => row.provider === 'google'
	);

	if (alreadyLinkedToGoogle) {
		throw new ForbiddenError(
			'You have already linked your StuyActivities account to a Google account.'
		);
	}

	const payload = await resolveGoogleIdToken(token);

	if (!payload) {
		throw new ApolloError(
			'That Google id token is not valid for this app.',
			'INVALID_OAUTH_TOKEN'
		);
	}

	if (!payload.email_verified) {
		throw new ApolloError(
			'You must verify your email address with google before you can link it to StuyActivities.',
			'EMAIL_NOT_VERIFIED'
		);
	}

	return await oAuthIds.create({
		userId: session.userId,
		platform: 'google',
		platformId: payload.sub,
		platformEmail: payload.email
	});
};
