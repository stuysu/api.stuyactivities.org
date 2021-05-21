export default async (
	meeting,
	_,
	{ signedIn, user, hasAdminRole, isOrgAdmin }
) => {
	if (!signedIn) {
		return null;
	}

	if (meeting.privacy === 'private') {
		const isClubPub = hasAdminRole('charters');
		const isAuditor = hasAdminRole('audits');

		if (isClubPub || isAuditor) {
			return meeting.description;
		}

		const isMember = user.memberships.some(
			m => m.organizationId === meeting.organizationId
		);

		if (!isMember) {
			return null;
		}
	}

	return meeting.description;
};
