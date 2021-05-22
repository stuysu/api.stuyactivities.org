import uploadPicStream from '../../../utils/uploadPicStream';
import { UserInputError } from 'apollo-server-express';
import { randomBytes } from 'crypto';

export default async (
	_,
	{ alt, file },
	{ authenticationRequired, user, models }
) => {
	authenticationRequired();

	const pic = await file;

	if (!pic.mimetype.startsWith('image/')) {
		throw new UserInputError('The uploaded file is not an image');
	}

	const randString = randomBytes(8).toString('hex');
	const publicId = `userUploads/${user.id}-${user.email}/${randString}`;

	await uploadPicStream(pic, publicId, {
		context: { alt, uploadingUserId: user.id }
	});

	// Use the idLoader to make sure the info from the server is loaded
	return await models.cloudinaryResources.idLoader.load(publicId);
};
