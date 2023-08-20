export default async (
    root,
	{ membershipRequirement },
	{ models : { settings, organizations, memberships }, adminRoleRequired, user }
) => {
    console.log("HELLO")
    adminRoleRequired('charters')

    let savedSetting =  await settings.findOne({})
    
    console.log(membershipRequirement)
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