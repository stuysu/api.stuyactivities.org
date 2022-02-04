export default async (
	_,
	{ userId, purchases, counts },
	{ adminRoleRequired, models: { sales } }
) => {
	adminRoleRequired('records');

	return purchases
		.map((purchase, i) =>
			counts[i] > 0 ? sales.create({ userId, itemId: purchase, count: counts[i] }) : true
		)
		.every(v => v !== null);
};
