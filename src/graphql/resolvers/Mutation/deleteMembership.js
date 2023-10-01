import { ApolloError, ForbiddenError } from 'apollo-server-express';
import sendEmail from '../../../utils/sendEmail';

export default async (parent, args, context) => {
	const { membershipId, notify } = args;
	const {
		models: {
			memberships,
			membershipRequests,
			organizations,
			settings,
			users
		},
		isOrgAdmin,
		authenticationRequired,
		verifyMembershipCount,
		user
	} = context;

	authenticationRequired();

	const membership = await memberships.idLoader.load(membershipId);

	if (!membership) {
		throw new ApolloError(
			'Could not find a membership with that id',
			'ID_NOT_FOUND'
		);
	}

	const orgAdmin = isOrgAdmin(membership.organizationId);

	if (!orgAdmin && membership.userId !== user.id) {
		throw new ForbiddenError(
			'Only org admins and users themselves can delete memberships'
		);
	}

	if (membership.adminPrivileges && membership.userId === user.id) {
		throw new ForbiddenError(
			'Admins are not allowed to remove themselves from organizations. Ask another admin to remove you.'
		);
	}

	// Now it should be safe to delete
	// Delete the membership requests made by this user too
	await membershipRequests.destroy({
		where: {
			userId: membership.userId,
			organizationId: membership.organizationId
		}
	});

	// Store it in a variable before we destroy the object
	const orgId = membership.organizationId;
	const removedUserId = membership.userId;
	await membership.destroy();

	const organization = await organizations.idLoader.load(orgId);

	if (notify) {
		const removedUser = await users.idLoader.load(removedUserId);
		await sendEmail({
			to: removedUser.email,
			subject: `Removed from ${organization.name} | StuyActivities`,
			template: 'memberRemoved.html',
			variables: {
				removedUser,
				organization
			}
		});
	}

	await verifyMembershipCount(organization, await settings.findOne({}));
	return true;
};
