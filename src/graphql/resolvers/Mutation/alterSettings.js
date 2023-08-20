export default async (
    _,
	{ membershipRequirement },
	{ models : { settings, organizations, memberships }, adminRoleRequired }
) => {
    adminRoleRequired('charters')

    let savedSetting =  await settings.findOne({})
    
    if (membershipRequirement !== savedSetting.membershipRequirement) {
        savedSetting.membershipRequirement = membershipRequirement

        // lock organizations if necessary
        let orgs = await organizations.findAll({});

        for (let org of orgs) {
            let allMemberships = await memberships.findAll({
                where: {
                    organizationId: org.id
                }
            })

            if (allMemberships.length < membershipRequirement) {
                org.locked = true;
            } else {
                org.locked = false;
            }

            await org.save();
        }

        await savedSetting.save()
    }

    return savedSetting
}