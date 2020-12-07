import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: {
			organizations,
			strikeComments,
			strikes,
			Sequelize: { Op }
		}
	} = context;
	const { strikeId, message } = args;

	const strike = await strikes.strikeIdLoader.load(strikeId);

	if (!strike) {
		throw new ApolloError("There's no strike with that id", 'ID_NOT_FOUND');
	}

	const org = await organizations.idLoader.load(strike.organizationId);

	session.authenticationRequired(['createStrikeComment']);

	const isAdmin = await session.adminRoleRequired(
		'strikes',
		['createStrikeComment'],
		true
	);

	const hasOrgAdmin = await session.orgAdminRequired(
		orgId,
		['createStrikeComment'],
		true
	);

	if (!isAdmin && !hasOrgAdmin) {
		throw new ForbiddenError(
			'Only club admins or StuyActivities admins are allowed to send messages'
		);
	}

	if (!message) {
		throw new UserInputError('The message cannot be left empty', {
			invalidArgs: ['message']
		});
	}

	// Make the comment
	return await strikeComments.create({
		strikeId: strikeId,
		userId: session.userId,
		message,
		auto: false,
		seen: false
	});
};
