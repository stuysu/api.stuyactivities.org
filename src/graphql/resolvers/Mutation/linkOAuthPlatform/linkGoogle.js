import resolveGoogleIdToken from '../../../../utils/resolveGoogleIdToken';
import { ApolloError, ForbiddenError } from 'apollo-server-express';

const { oAuthIds } = require('./../../../../database');

export default async ({ token, user }) => {
	const userOAuths = await oAuthIds.userIdLoader.load(user.id);

	const alreadyLinkedToGoogle = userOAuths.find(
		row => row.platform === 'google'
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

	// Check to see if this google account is linked to any other stuyactivities accounts
	const linkedToAnother = await oAuthIds.findOne({
		where: { platformId: payload.sub, platform: 'google' }
	});

	if (linkedToAnother) {
		throw new ApolloError(
			'That Google account is already linked to another StuyActivities account. You must unlink it from there before you can link it to this account.',
			'EMAIL_LINKED_TO_OTHER'
		);
	}

	return await oAuthIds.create({
		userId: user.id,
		platform: 'google',
		platformId: payload.sub,
		platformEmail: payload.email
	});
};
