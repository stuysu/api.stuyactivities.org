export default async (_, {}, { models: { settings } }) => {
    const savedSettings = await settings.findOne({})

    console.log("HELLO")

    return savedSettings
};