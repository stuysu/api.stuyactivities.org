export default async (parent, args, context) => {
	const {
		session,
		models: { strikes }
	} = context;

	session.authenticationRequired([]);
	await session.adminRoleRequired('Strikes', ['createStrike']);

	let { organizationId, weight, reviewer, reason } = args;

	const strike = await strikes.create({
		organizationId,
		weight,
		reviewer,
		reason
	});
};
