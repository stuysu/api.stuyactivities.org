export default async (
	_,
	{ membershipRequirement },
	{
		models: { settings, organizations, memberships },
		adminRoleRequired,
		verifyMembershipCount
	}
) => {
	adminRoleRequired('charters');

	let savedSetting = await settings.findOne({});

	if (membershipRequirement !== savedSetting.membershipRequirement) {
		savedSetting.membershipRequirement = membershipRequirement;

		// lock organizations if necessary
		let orgs = await organizations.findAll({});

		for (let org of orgs) verifyMembershipCount(org, savedSetting);

		await savedSetting.save();
	}

	return savedSetting;
};
