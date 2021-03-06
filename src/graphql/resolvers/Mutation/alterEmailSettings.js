import { ApolloError, ForbiddenError } from 'apollo-server-express';

export default async (
	parent,
	{
		membershipId,
		meetingNotification,
		updateNotification,
		meetingReminderTime
	},
	{ models: { memberships }, authenticationRequired, user }
) => {
	authenticationRequired();

	const membership = await memberships.idLoader.load(membershipId);

	if (!membership) {
		throw new ApolloError(
			'Could not find a membership with that id.',
			'ID_NOT_FOUND'
		);
	}

	if (membership.userId !== user.id) {
		throw new ForbiddenError(
			'You are not allowed to alter the email settings of a membership that is not your own!'
		);
	}

	if (meetingNotification !== undefined)
		membership.meetingNotification = meetingNotification;
	if (updateNotification !== undefined)
		membership.updateNotification = updateNotification;
	if (meetingReminderTime !== undefined)
		membership.meetingReminderTime = meetingReminderTime;

	return await membership.save();
};
