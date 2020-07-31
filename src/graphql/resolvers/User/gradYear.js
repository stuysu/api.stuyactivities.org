export default (user, args, context) => {
	context.session.authenticationRequired(['gradYear']);

	return user.gradYear;
};
