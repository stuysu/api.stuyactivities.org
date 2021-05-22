export default async (
	root,
	{ userId, honeybadgerId, status, path, ipAddress },
	{ models: { helpRequests }, authenticationRequired, hasAdminRole, user }
) => {
	authenticationRequired();
	const isAdmin = hasAdminRole('helpRequests');

	const where = {};

	if (isAdmin) {
		if (typeof userId === 'number') {
			where.userId = userId;
		}
	} else {
		where.userId = user.id;
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
