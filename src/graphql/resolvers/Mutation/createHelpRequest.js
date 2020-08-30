import { ForbiddenError, UserInputError } from 'apollo-server-errors';
import * as EmailValidator from 'email-validator';
import axios from 'axios';
import { CAPTCHA_SECRET } from '../../../constants';

const CAPTCHA_VALIDATION_URL = `https://www.google.com/recaptcha/api/siteverify`;

export default async (
	root,
	{ email, title, description, captchaToken, honeybadgerId, path },
	{ models: { helpRequests, Sequelize }, session, ipAddress }
) => {
	if (!captchaToken) {
		throw new UserInputError(
			'A valid ReCaptcha token is required to make a help request.'
		);
	}

	if (!title) {
		throw new UserInputError('The title field cannot be left empty.');
	}

	if (!description) {
		throw new UserInputError('The description field cannot be left empty.');
	}

	if (!session.signedIn && !email) {
		throw new ForbiddenError(
			'If you are not signed in, you need to provide a valid email address'
		);
	}

	if (!EmailValidator.validate(email)) {
		throw new ForbiddenError('That email address is not valid.');
	}

	let response;
	// Now validate the recaptcha token that was provided.
	try {
		response = await axios.post(CAPTCHA_VALIDATION_URL, {
			secret: CAPTCHA_SECRET,
			response: captchaToken,
			ip: ipAddress
		});
	} catch (er) {
		throw new ForbiddenError('That ReCaptcha token is not valid.');
	}

	if (!response.data.success) {
		throw new ForbiddenError(
			'ReCaptcha validation failed. Please try again.'
		);
	}

	const now = new Date();
	const captchaCreation = new Date(response.data.challenge_ts);
	const diff = now.getTime() - captchaCreation.getTime();
	const tenMinutes = 1000 * 60 * 10;

	const oneHour = 1000 * 60 * 60;

	if (diff > tenMinutes) {
		throw new ForbiddenError(
			'That ReCaptcha token is no longer trusted. Please try again.'
		);
	}

	// Now check to see how many were submitted by this ip address recently
	const similarRequests = await helpRequests.findMany({
		where: {
			ipAddress,
			createdAt: {
				[Sequelize.Op.gt]: new Date(now.getTime() - oneHour)
			}
		}
	});

	if (similarRequests.length > 10) {
		throw new ForbiddenError(
			'You are sending too many requests. Please wait before sending another one.'
		);
	}

	const requestObj = {
		email,
		title,
		description,
		captchaToken,
		honeybadgerId,
		path,
		ipAddress,
		status: 'new'
	};

	if (session.signedIn) {
		requestObj.userId = session.userId;
	}

	// Now we can actually go about creating the request
	return helpRequests.create(requestObj);
};
