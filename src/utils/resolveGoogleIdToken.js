import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../constants';

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

export default resolveGoogleIdToken;
