export default async (
	update,
	params,
	{ models, authenticationRequired, isOrgAdmin, hasAdminRole }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(update.organizationId);
	const isSUAdmin = hasAdminRole('updates');

	if (!orgAdmin && !isSUAdmin) {
		return null;
	}

	return models.updateApprovalMessages.updateIdLoader.load(update.id);
};
