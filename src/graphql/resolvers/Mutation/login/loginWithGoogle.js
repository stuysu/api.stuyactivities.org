import { ApolloError } from 'apollo-server-express';
import resolveGoogleIdToken from '../../../../utils/resolveGoogleIdToken';
import { sign } from 'jsonwebtoken';

const { users, oAuthIds, keyPairs } = require('../../../../database');

const loginWithGoogle = async ({ googleOAuthToken, setCookie }) => {
	const payload = await resolveGoogleIdToken(googleOAuthToken);

	if (!payload) {
		throw new ApolloError(
			'That Google id token is not valid for this app.',
			'INVALID_OAUTH_TOKEN'
		);
	}

	if (!payload.email_verified) {
		throw new ApolloError(
			'You must verify your email address with google before you can use it to sign in.',
			'EMAIL_NOT_VERIFIED'
		);
	}

	// Check to see if this google account was linked to any user in the database
	const oAuthId = await oAuthIds.findOne({
		where: {
			platformId: payload.sub,
			platform: 'google'
		},
		include: users
	});

	let user = oAuthId ? oAuthId.user : null;

	if (!user) {
		user = await users.findOne({
			where: {
				email: payload.email
			},
			order: [['gradYear', 'desc']]
		});

		if (user) {
			user.picture = payload.picture;
			user.firstName = payload.given_name;
			user.lastName = payload.family_name;
			await user.save();

			await oAuthIds.create({
				userId: user.id,
				platform: 'google',
				platformId: payload.sub,
				platformEmail: payload.email
			});
		}
	}

	// The user is not in the database. Might be possible that the database is incomplete
	// Check if their email belongs to Stuy or even the DOE
	if (!user) {
		const belongsWithSchool =
			payload.email.endsWith('@stuy.edu') ||
			payload.email.endsWith('@schools.nyc.gov');

		// This here means that they have a school email but they're not in the database
		if (belongsWithSchool) {
			// Return a special type of error that will prompt the front-end to collect their info
			throw new ApolloError(
				"You might belong here, but you're not in the database",
				'POSSIBLE_UNKNOWN_USER'
			);
		}

		// If they don't belong with the school
		// It's a stranger trying to sign in with a personal gmail
		// Reject and throw apollo error
		throw new ApolloError(
			'That email address is not linked to any existing StuyActivities Account',
			'UNKNOWN_EMAIL'
		);
	}

	const { privateKey, passphrase } = await keyPairs.getSigningKey();

	const { id, firstName, lastName, email } = user;

	const token = await sign(
		{
			user: {
				id,
				firstName,
				lastName,
				email
			}
		},
		{ key: privateKey, passphrase },
		{ algorithm: 'RS256', expiresIn: '30d' }
	);

	setCookie('auth-jwt', token, {
		maxAge: 1000 * 60 * 24 * 30,
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true
	});

	return token;
};

export default loginWithGoogle;
