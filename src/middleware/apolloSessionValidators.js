import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
const { memberships, adminRoles, users } = require('./../database');

const apolloSessionValidators = (req, res, next) => {
	let user, userMemberships;

	req.session.getUser = async () => {
		if (!user) {
			user = await users.idLoader.load(req.session.id);
		}
		return user;
	};

	req.session.getMemberships = async () => {
		if (!req.session.signedIn) {
			return [];
		}

		if (!userMemberships) {
			userMemberships = await memberships.userIdLoader.load(
				req.session.userId
			);
		}

		return userMemberships;
	};

	req.session.authenticationRequired = fields => {
		if (!req.session.signedIn) {
			let message =
				'You must be signed in to perform one or more parts of this request.';

			if (fields) {
				message =
					'You must be signed in to perform one or more parts of this request: ' +
					fields.join(', ');
			}

			throw new AuthenticationError(message);
		}
	};

	req.session.orgAdminRequired = async (orgId, fields, silent = false) => {
		const mems = await req.session.getMemberships();

		const canPerformOperation = mems.some(
			mem => mem.organizationId === orgId && mem.adminPrivileges
		);

		if (!canPerformOperation) {
			if (silent) {
				return false;
			}

			let message =
				'You must be an admin of one or more organizations to perform one or more parts of this request.';

			if (fields) {
				message =
					'You must be an admin of one or more organizations to perform one or more parts of this request: ' +
					fields.join(', ');
			}

			throw new ForbiddenError(message);
		}

		if (silent) {
			return true;
		}
	};

	let adminRolesPresent;

	req.session.adminRoleRequired = async (role, fields, silent = false) => {
		if (!adminRolesPresent) {
			const roles = await adminRoles.userIdLoader.load(
				req.session.userId
			);

			adminRolesPresent = {};
			roles.forEach(adminRole => {
				adminRolesPresent[adminRole.role] = adminRole;
			});
		}

		const canPerformOperation = Boolean(adminRolesPresent[role]);

		if (!canPerformOperation) {
			if (silent) {
				return false;
			}

			let message = `You must have the ${role} admin role to perform one or more parts of this request.`;

			if (fields) {
				message =
					`You must have the ${role} admin role to perform one or more parts of this request: ` +
					fields.join(', ');
			}

			throw new ForbiddenError(message);
		}

		if (silent) {
			return true;
		}
	};

	next();
};

export default apolloSessionValidators;
