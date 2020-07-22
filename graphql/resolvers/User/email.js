module.exports = (user, args, context) => {
	context.session.authenticationRequired(['email']);

	return user.email;
};
