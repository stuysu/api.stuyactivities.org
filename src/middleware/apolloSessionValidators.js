import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
const { memberships, adminRoles } = require('./../database');

const apolloSessionValidators = (req, res, next) => {
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

	let membershipsWithAdminPrivileges;

	req.session.orgAdminRequired = async (orgId, fields) => {
		if (!membershipsWithAdminPrivileges) {
			membershipsWithAdminPrivileges = await userMemberships.findAll({
				where: { adminPrivileges: true, userId: req.session.userId }
			});
		}

		const canPerformOperation = membershipsWithAdminPrivileges.some(
			mem => mem.organizationId === orgId
		);

		if (!canPerformOperation) {
			let message =
				'You must be an admin of one or more organizations to perform one or more parts of this request.';

			if (fields) {
				message =
					'You must be an admin of one or more organizations to perform one or more parts of this request: ' +
					fields.join(', ');
			}

			throw new ForbiddenError(message);
		}
	};

	let adminRolesPresent;

	req.session.adminRoleRequired = async (role, fields) => {
		if (!adminRolesPresent) {
			adminRolesPresent = await adminRoles.userIdLoader.load(
				req.session.userId
			);
		}

		const canPerformOperation = adminRolesPresent.some(
			admin => admin.role === role
		);

		if (!canPerformOperation) {
			let message = `You must have the ${role} admin role to perform one or more parts of this request.`;

			if (fields) {
				message =
					`You must have the ${role} admin role to perform one or more parts of this request: ` +
					fields.join(', ');
			}

			throw new ForbiddenError(message);
		}
	};

	next();
};

export default apolloSessionValidators;
