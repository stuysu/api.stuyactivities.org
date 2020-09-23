import { ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ orgId, isAttending, meetingLink },
	{ session, models }
) => {
	throw new ForbiddenError(
		'You are not allowed to change your response after the deadline.'
	);
	session.authenticationRequired();
	await session.orgAdminRequired(orgId);

	let response = await models.clubFairResponses.findOne({
		where: {
			organizationId: orgId
		}
	});

	if (response) {
		response.isAttending = isAttending;
		if (meetingLink) {
			response.meetingLink = meetingLink;
		}
		await response.save();
	} else {
		response = await models.clubFairResponses.create({
			organizationId: orgId,
			isAttending,
			meetingLink
		});
	}

	return response;
};
