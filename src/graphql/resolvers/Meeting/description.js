export default async (meeting, _, { session }) => {
	if (!session.signedIn) {
		return null;
	}

	if (meeting.privacy === 'private') {
		const isClubPub = await session.adminRoleRequired("charters", [], true);

		if(isClubPub){
			return meeting.description;
		}

		const orgMemberships = await session.getMemberships();

		const isMember = orgMemberships.some(
			membership => membership.organizationId === meeting.organizationId
		);

		if (!isMember) {
			return null;
		}
	}

	return meeting.description;
};
