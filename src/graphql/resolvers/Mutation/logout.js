export default (root, args, { setCookie }) => {
	setCookie('auth-jwt', '', {
		expires: new Date(1),
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true
	});

	setCookie('session', '', {
		expires: new Date(1),
		httpOnly: true,
		path: '/',
		sameSite: 'none',
		secure: true
	});
};
