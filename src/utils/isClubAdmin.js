export default async (userId, organizationId, memberships) => {
	return await memberships.findOne({
		where: {
			userId,
			adminPrivileges: true,
			organizationId
		}
	});
};
