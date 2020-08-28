import { ApolloError, UserInputError } from 'apollo-server-express';
import isClubAdmin from '../../../utils/isClubAdmin';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: {
			memberships,
			organizations,
			charterEdits,
			charterApprovalMessages,
			Sequelize: { Op }
		}
	} = context;

	const { orgId, message } = args;

	if (!orgId || !message) {
		throw new UserInputError(
			'The organization ID and message are required to make a comment!',
			{
				invalidArgs: ['orgId', 'message']
			}
		);
	}

	if (!isClubAdmin(session.userId, orgId, memberships)) {
		session.authenticationRequired(['charters']);
	}

	//Make sure the organization exists
	const organization = await organizations.findOne({ where: { id: orgId } });
	if (!organization) {
		throw new ApolloError(
			'Could not find an organization with that id',
			'ORG_NOT_FOUND'
		);
	}

	// Make the comment
	return await charterApprovalMessages.create({
		organizationId: orgId,
		userId: session.userId,
		message,
		auto: false,
		seen: false
	});
};
