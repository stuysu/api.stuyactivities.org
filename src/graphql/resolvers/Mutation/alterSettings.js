export default async (
    root,
	{ membershipRequirement },
	{ models : { settings, organizations, memberships }, adminRoleRequired, user }
) => {
    adminRoleRequired('charters')

    let savedSetting =  await settings.findOne({})

    if (membershipRequirement !== savedSetting.membershipRequirement) {
        savedSetting.membershipRequirement = membershipRequirement

        // lock organizations if necessary
        let orgs = await organizations.findAll({});

        for (let org of orgs) {
            let memberships = await memberships.findAll({
                where: {
                    organizationId: org.id
                }
            })

            if (memberships.length < membershipRequirement) {
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