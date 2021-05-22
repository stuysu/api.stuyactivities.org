export default (user, args, { authenticationRequired }) => {
	authenticationRequired();
	return user.gradYear;
};
