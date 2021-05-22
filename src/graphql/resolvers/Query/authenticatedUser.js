export default (root, args, { signedIn, user }) => {
	if (signedIn) {
		return user;
	}

	return null;
};
