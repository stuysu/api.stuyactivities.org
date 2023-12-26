import { UserInputError } from 'apollo-server-express';

export default async (
	user,
	{ email, isFaculty },
	{ adminRoleRequired, models: { users } }
) => {
	adminRoleRequired('users');
	email = email.toLowerCase();
	if (await users.emailLoader.load(email)) {
		throw new UserInputError('That email already has an account.');
	}
	if (!email.match(/[a-zA-Z\d.]+@stuy(su)?.(edu|org)/)) {
		throw new UserInputError(
			'Invalid email. Please only enter stuy.edu or stuysu.org email addresses.'
		);
	}

	return await users.create({
		email,
		isFaculty
	});
};
