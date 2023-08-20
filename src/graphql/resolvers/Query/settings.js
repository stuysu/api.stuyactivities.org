export default async (root, args, context) => {
    const {
		models: { settings }, adminRoleRequired
	} = context;

    adminRoleRequired('charters');

    let savedSetting = settings.findOne({})

    return savedSetting
}