export default async (_, {}, { models: { settings } }) => {
    const savedSettings = await settings.findOne({})

    return savedSettings
};