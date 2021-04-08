import uploadPicStream from '../../../utils/uploadPicStream';
import { UserInputError } from 'apollo-server-express';
import { randomBytes } from 'crypto';

export default async (_, { alt, file }, { session, models }) => {
	session.authenticationRequired(['uploadImage']);

	const pic = await file;

	if (!pic.mimetype.startsWith('image/')) {
		throw new UserInputError('The uploaded file is not an image');
	}

	const user = await models.users.findOne({ id: session.userId });

	const randString = randomBytes(8).toString('hex');
	const publicId = `userUploads/${user.id}-${user.email}/${randString}`;

	await uploadPicStream(pic, publicId, {
		context: { alt, uploadingUserId: user.id }
	});

	// Use the idLoader to make sure the info from the server is loaded
	return await models.cloudinaryResources.idLoader.load(publicId);
};
