import { ApolloError, ForbiddenError } from 'apollo-server-express';
import sendEmail from '../../../utils/sendEmail';

export default async (parent, args, context) => {
	const { membershipId, notify } = args;
	const {
		session,
		models: { memberships, membershipRequests, users, organizations }
	} = context;

	session.authenticationRequired(['deleteMembership']);

	const membership = await memberships.idLoader.load(membershipId);

	if (!membership) {
		throw new ApolloError(
			'Could not find a membership with that id',
			'ID_NOT_FOUND'
		);
	}

	const isOrgAdmin = await session.orgAdminRequired(
		membership.organizationId,
		['deleteMembership'],
		true
	);

	if (!isOrgAdmin && membership.userId !== session.userId) {
		throw new ForbiddenError(
			'Only org admins and users themselves can delete memberships'
		);
	}

	if (membership.adminPrivileges && membership.userId === session.userId) {
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
	const userId = membership.userId;
	const orgId = membership.organizationId;
	await membership.destroy();

	if (notify) {
		const user = await users.idLoader.load(userId);
		const organization = await organizations.idLoader.load(orgId);

		await sendEmail({
			to: user.email,
			subject: `Removed from ${organization.name} | StuyActivities`,
			template: 'memberRemoved.html',
			variables: {
				user,
				organization
			}
		});
	}

	return true;
};
