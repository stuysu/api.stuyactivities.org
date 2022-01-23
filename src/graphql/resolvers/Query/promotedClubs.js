export default async (parent, {orgId}, {models}) => {
  if(orgId){
    return [models.promotedClubs.orgIdLoader.load(orgId)];
  }
  
  const allPromotedClubs = await models.promotedClubs.findAll();
  return allPromotedClubs;
}