export default (user, args, context) => {
	context.session.authenticationRequired(['email']);

	return user.email;
};
