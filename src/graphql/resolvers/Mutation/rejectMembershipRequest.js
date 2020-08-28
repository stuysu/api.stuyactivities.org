import { ApolloError, ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId },
	{ models: { membershipRequests }, session }
) => {
	session.authenticationRequired(['rejectMembershipRequest']);

	const request = await membershipRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no membership request with that id.',
			'ID_NOT_FOUND'
		);
	}

	// That means this is an invite and the user hasn't yet approved
	if (request.adminApproval) {
		if (session.userId !== request.userId) {
			throw new ForbiddenError(
				'Only the user the request belongs to may reject it.'
			);
		}

		request.userApproval = false;
	} else {
		// this is an admin approving it for the user
		await session.orgAdminRequired(request.organizationId);
		request.adminApproval = false;
	}

	await request.save();
	return request;
};
