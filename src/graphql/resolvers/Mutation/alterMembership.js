import { ApolloError, ForbiddenError } from 'apollo-server-express';
import sendEmail from '../../../utils/sendEmail';

export default async (parent, args, context) => {
	const { adminPrivileges, role, membershipId, notify } = args;
	const {
		models: { memberships, users, organizations },
		authenticationRequired,
		orgAdminRequired,
		user
	} = context;

	authenticationRequired();

	const membership = await memberships.idLoader.load(membershipId);

	if (!membership) {
		throw new ApolloError(
			'Could not find a membership with that id.',
			'ID_NOT_FOUND'
		);
	}

	orgAdminRequired(membership.organizationId, ['alterMembership']);

	if (typeof adminPrivileges !== 'undefined') {
		if (membership.userId === user.id && !adminPrivileges) {
			throw new ForbiddenError(
				'You are not allowed to remove yourself as an admin.'
			);
		}

		membership.adminPrivileges = adminPrivileges;
	}

	if (role) {
		membership.role = role;
	}

	await membership.save();

	if (notify) {
		const organization = await organizations.idLoader.load(
			membership.organizationId
		);

		await sendEmail({
			to: user.email,
			subject: `${organization.name}: Membership Altered | StuyActivities`,
			template: 'memberAltered.html',
			variables: {
				membership,
				organization,
				user
			}
		});
	}

	return membership;
};
