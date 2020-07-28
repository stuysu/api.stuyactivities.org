const {
	ApolloError,
	UserInputError,
	ForbiddenError
} = require('apollo-server-express');

const { EDITABLE_CHARTER_FIELDS } = require('./../../../constants');

module.exports = async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: { memberships, organizations }
	} = context;
	session.authenticationRequired([]);

	if (!args.orgId && !args.orgUrl) {
		throw new UserInputError(
			'Either the organization url or its id must be passed in order to alter its charter',
			{
				invalidArgs: ['orgUrl', 'orgId']
			}
		);
	}

	let org;

	if (args.orgId) {
		org = await organizations.findOne({ where: { id: args.orgId } });
	} else if (args.orgUrl) {
		org = await organizations.findOne({ where: { url: args.orgUrl } });
	}

	if (!org) {
		throw new ApolloError(
			'Could not find an organization with that url or id',
			'ORG_NOT_FOUND'
		);
	}

	const isAdmin = await memberships.findOne({
		where: {
			userId: session.userId,
			adminPrivileges: true,
			organizationId: org.id
		}
	});

	if (!isAdmin) {
		throw new ForbiddenError(
			'Only admins are allowed to propose changes to the charter'
		);
	}
};
