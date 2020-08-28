import {
	ApolloError,
	UserInputError,
	ForbiddenError
} from 'apollo-server-express';
import isClubAdmin from '../../../utils/isClubAdmin';
import sendEmail from '../../../utils/sendEmail';

export default async (parent, args, context) => {
	const { orgId, userId } = args;
	const {
		session,
		models: { memberships }
	} = context;

	if (!orgId || !userId) {
		throw new UserInputError(
			'The organization ID (orgId) and user ID (userId) are required to remove a member!',
			{ invalidArgs: ['orgId', 'userId'] }
		);
	}
	//see if user is an admin
	if (!isClubAdmin(session.userId, orgId, memberships)) {
		throw new ForbiddenError(
			'You do not have the right to remove members from this club!'
		);
	}

	const membership = await memberships.findOne({
		where: {
			organizationId: orgId,
			userId
		}
	});
	if (!membership) {
		throw new ApolloError(
			'Could not find a membership with that userId and that orgId',
			'MEMBERSHIP_NOT_FOUND'
		);
	}
	await memberships.destroy({
		where: {
			organizationId: orgId,
			userId
		}
	});

	const user = await membership.getUser();
	const organization = await membership.getOrganization();
	await sendEmail({
		to: user.email,
		subject: 'You have been removed from a club | StuyActivities',
		template: 'memberRemoved.html',
		variables: {
			user,
			organization
		}
	});
	return true;
};
