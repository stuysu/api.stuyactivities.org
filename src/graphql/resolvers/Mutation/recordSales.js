export default async (_, { userId, purchases, counts }, { adminRoleRequired, models: { sales } }) => {
	adminRoleRequired('records');

	return data.map((args, i) => sales.create({ userId, itemId: purchases[i], count: counts[i] })).every(v => v !== null);
};
