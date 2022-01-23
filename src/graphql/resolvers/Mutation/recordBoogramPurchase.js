import uploadPicStream from '../../../utils/uploadPicStream';
import { ForbiddenError } from 'apollo-server-errors';
import { UserInputError } from 'apollo-server-express';
import { randomBytes } from 'crypto';

export default async (_, args, { adminRoleRequired, models: { boograms } }) => {
	adminRoleRequired('records');

	if (args.twoDollarCount !== 0) {
		throw new ForbiddenError('$2 candies are no longer allowed.');
	}

	return boograms.create(args) !== null;
};
