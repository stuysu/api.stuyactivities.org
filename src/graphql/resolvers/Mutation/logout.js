export default (root, args, { setCookie }) => {
	setCookie('auth-jwt', '', {
		expires: new Date(1),
		httpOnly: true,
		path: '/'
	});

	setCookie('session', '', {
		expires: new Date(1),
		httpOnly: true,
		path: '/'
	});
};
