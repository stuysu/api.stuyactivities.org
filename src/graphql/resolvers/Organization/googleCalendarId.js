export default async (org, args, { models, session }) => {
	const mems = await session.getMemberships();

	const membership = mems.find(mem => mem.organizationId === org.id);

	if (membership) {
		const googleCalendar = await models.googleCalendars.orgIdLoader.load(
			org.id
		);
		if (googleCalendar) {
			return googleCalendar.gCalId;
		}
	}

	return null;
};
