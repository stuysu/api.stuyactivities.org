const { ApolloError } = require('apollo-server-express');
const { users, oAuthIds } = require('./../../../../database');

const { GOOGLE_CLIENT_ID } = require('./../../../../constants');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const resolveGoogleIdToken = async idToken => {
	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID
		});

		return await ticket.getPayload();
	} catch (e) {
		return null;
	}
};

const loginWithGoogle = async (googleOAuthToken, session) => {
	const payload = await resolveGoogleIdToken(googleOAuthToken);

	if (!payload) {
		throw new ApolloError(
			'That Google Id Token is not valid for this app.',
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
	const oAuthRow = await oAuthIds.findOne({
		where: { platform: 'google', platformId: payload.sub }
	});

	// The google id is linked to a valid user, update the session and return the user object
	if (oAuthRow) {
		session.signedIn = true;
		session.userId = oAuthRow.userId;
		return await users.findOne({ where: { id: oAuthRow.userId } });
	}

	// It might be someone's first time using the google login
	// Check to see if an account exists with their email
	const user = await users.findOne({
		where: {
			email: payload.email,
			active: true
		},
		order: [['gradYear', 'desc']]
	});

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

	// ----- If we're here that means the user is in the database
	// but this oAuth platform isn't registered for them
	// we're gonna register it for them here right now
	session.signedIn = true;
	session.userId = user.id;

	await oAuthIds.create({
		userId: user.id,
		platform: 'google',
		platformId: payload.sub,
		platformEmail: payload.email
	});

	return user;
};

module.exports = loginWithGoogle;
