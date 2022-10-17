export default async (
	_,
	{ userId, purchases, counts, purchaserOsis },
	{ adminRoleRequired, user, models: { sales } }
) => {
	adminRoleRequired('boograms2022');

	return purchases
		.map((purchase, i) =>
			(counts[i] != 0 && sales.create({ userId, purchaserOsis: purchaserOsis, recorderId: user.id, itemId: purchase, count: counts[i] }))
		)
		.every(v => v !== null);
};
