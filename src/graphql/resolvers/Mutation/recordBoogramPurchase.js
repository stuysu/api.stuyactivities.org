import uploadPicStream from '../../../utils/uploadPicStream';
import { UserInputError } from 'apollo-server-express';
import { randomBytes } from 'crypto';

export default async (
	_,
	args,
	{ adminRoleRequired, user, models: { boograms } }
) => {
	adminRoleRequired('records');

	return boograms.create({ userId: user.id, ..args }) !== null;
};
