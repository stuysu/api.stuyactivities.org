import { ApolloError } from 'apollo-server-errors';

export default async (root, { promotedClubId }, { models, adminRoleRequired }) => {
  adminRoleRequired('promotedClubs');

  const promotedClub = await models.promotedClubs.idLoader.load(promotedClubId);

	if (!promotedClub) {
    throw new ApolloError("There's no promoted club with that id", 'PROMOTED_CLUB_NOT_FOUND');
	}

	await promotedClub.destroy();
  return true;
};
