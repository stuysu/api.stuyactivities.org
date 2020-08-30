export default async (
	root,
	{ userId, honeybadgerId, status, path, ipAddress },
	{ models: { helpRequests }, session }
) => {
	session.authenticationRequired(['helpRequests']);
	const isAdmin = await session.adminRoleRequired(
		'helpRequests',
		['helpRequests'],
		true
	);

	const where = {};

	if (isAdmin) {
		if (typeof userId === 'number') {
			where.userId = userId;
		}
	} else {
		where.userId = session.userId;
	}

	if (honeybadgerId) {
		where.honeybadgerId = honeybadgerId;
	}

	if (status) {
		where.status = status;
	}

	if (path) {
		where.path = path;
	}

	if (ipAddress) {
		where.ipAddress = ipAddress;
	}

	return await helpRequests.findAll({ where });
};
