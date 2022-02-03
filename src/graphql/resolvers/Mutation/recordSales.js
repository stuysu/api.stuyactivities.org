export default async (
	_,
	{ userId, purchases, counts },
	{ adminRoleRequired, models: { sales } }
) => {
	adminRoleRequired('records');

	return purchases
		.map((purchase, i) =>
			sales.create({ userId, itemId: purchase, count: counts[i] })
		)
		.every(v => v !== null);
};
