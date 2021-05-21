import { createComplexityLimitRule } from 'graphql-validation-complexity';
import {
	ApolloError,
	ApolloServer,
	ValidationError,
	ForbiddenError
} from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import honeybadger from 'honeybadger';
import getJWTPayload from '../utils/auth/getJWTPayload';

const models = require('../database');
const { users, adminRoles, memberships } = models;

const ComplexityLimitRule = createComplexityLimitRule(75000, {
	scalarCost: 1,
	objectCost: 5,
	listFactor: 10
});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req, res }) => {
		let user, signedIn;

		let jwt =
			req.cookies['auth-jwt'] ||
			req.headers['x-access-token'] ||
			req.headers['authorization'];

		if (jwt && jwt.startsWith('Bearer ')) {
			jwt = jwt.replace('Bearer ', '');
		}

		if (jwt) {
			const data = await getJWTPayload(jwt);

			if (data) {
				user = await users.findOne({
					id: data.user.id,
					include: [adminRoles, memberships]
				});
			}

			signedIn = Boolean(user);
		}

		function authenticationRequired() {
			if (!signedIn) {
				throw new ForbiddenError(
					'You must be signed in to perform that query'
				);
			}
		}

		const adminRoles =
			signedIn && new Set(user.adminRoles.map(a => a.role));

		function hasAdminRole(role) {
			return signedIn && adminRoles.has(role);
		}

		function isOrgAdmin(orgId) {
			return (
				signedIn &&
				user.memberships.some(
					m => m.organizationId === orgId && m.adminPrivileges
				)
			);
		}

		function adminRequired(role) {
			authenticationRequired();
			if (!hasAdminRole(role)) {
				throw new ForbiddenError(
					"You don't have the necessary permissions to perform that query"
				);
			}
		}

		function orgAdminRequired(orgId) {
			authenticationRequired();
			if (!isOrgAdmin(orgId)) {
				throw new ForbiddenError(
					"You don't have the necessary permissions to perform that query"
				);
			}
		}

		return {
			signedIn,
			authenticationRequired,
			orgAdminRequired,
			isOrgAdmin,
			hasAdminRole,
			adminRequired,
			models,
			ipAddress:
				req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			setCookie: res.cookie
		};
	},
	uploads: false,
	introspection: true,
	playground: {
		settings: {
			'request.credentials': 'same-origin'
		}
	},
	validationRules: [ComplexityLimitRule],
	formatError: err => {
		const safeError =
			err.originalError instanceof ApolloError ||
			err instanceof ValidationError ||
			err.originalError.message === 'Not allowed by CORS';

		honeybadger.notify(err, {
			context: {
				originalError: err.originalError
			}
		});

		const internalError =
			err &&
			err.extensions &&
			err.extensions.code &&
			err.extensions.code === 'INTERNAL_SERVER_ERROR';

		// This is an unexpected error and might have secrets
		if (!safeError || internalError) {
			console.error(err.originalError);

			// report this error to us but hide it from the client
			// honeybadger.notify(err.originalError);
			return new Error(
				`There was an unknown error on the server. Rest assured it has been reported. Feel free to contact us at it@stuysu.org to provide more information.`
			);
		}

		// Might want to hide the stack trace for security in production
		if (
			process.env.NODE_ENV === 'production' &&
			err.extensions &&
			err.extensions.exception &&
			err.extensions.exception.stacktrace
		) {
			delete err.extensions.exception.stacktrace;
		}

		return err;
	}
});

export default apolloServer;
