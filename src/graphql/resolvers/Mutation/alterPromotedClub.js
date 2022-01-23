import { ApolloError } from 'apollo-server-errors';

export default async (root, { promotedClubId, orgId, blurb }, { models, adminRoleRequired }) => {
  adminRoleRequired('promotedClubs');

  const promotedClub = await models.promotedClubs.idLoader.load(promotedClubId);

	if (!promotedClub) {
    throw new ApolloError("There's no promoted club with that id", 'PROMOTED_CLUB_NOT_FOUND');
	}
  
  if(orgId){
    const org = await models.organizations.idLoader.load(orgId);
    
    if (!org) {
      throw new ApolloError("There's no organization with that id", 'ID_NOT_FOUND');
    }
    
    promotedClub.organizationId = orgId;
  }
  
  if(blurb){
    promotedClub.blurb = blurb;
  }
  
	await promotedClub.save();
  return promotedClub;
};
