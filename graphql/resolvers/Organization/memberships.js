module.exports = (org, params) => {
	if (!params.onlyLeaders) {
		return org.memberships || org.getMembers();
	}

	if (org.memberships) {
		return org.memberships.filter(member => member.adminPrivileges);
	}

	return org.getMembers({
		where: {
			adminPrivileges: true
		}
	});
};
