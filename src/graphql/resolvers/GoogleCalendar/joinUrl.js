export default async (calendar, args, { session }) => {
	const user = await session.getUser();
	const emailRegex = new RegExp(/@(stuy\.edu|gmail\.com)$/i);

	if (emailRegex.test(user.email)) {
		return calendar.getJoinUrl(user.email);
	}

	return calendar.getJoinUrl();
};
