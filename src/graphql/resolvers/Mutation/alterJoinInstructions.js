import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';

export default async (parent, args, context) => {
	// first steps, make sure they have sufficient permissions to make changes to the charter
	const {
		session,
		models: { organizations, joinInstructions }
	} = context;
	const { orgId, instructions, buttonEnabled } = args;

	const org = await organizations.idLoader.load(orgId);

	if (!org) {
		throw new ApolloError(
			"There's no organization with that id",
			'ID_NOT_FOUND'
		);
	}

	const hasOrgAdmin = await session.orgAdminRequired(
		orgId,
		['alterJoinInstructions'],
		true
	);

	if (!hasOrgAdmin) {
		throw new ForbiddenError(
			'Only club admins can change join instructions!'
		);
	}

	const currJoinInstructions = await joinInstructions.orgIdLoader.load(orgId);
	if (currJoinInstructions) {
		if (instructions) {
			currJoinInstructions.instructions = instructions;
		}
		if (buttonEnabled !== undefined && buttonEnabled !== null) {
			currJoinInstructions.buttonEnabled = buttonEnabled;
		}
		return await currJoinInstructions.save();
	} else {
		return await joinInstructions.create({
			organizationId: orgId,
			instructions,
			buttonEnabled:
				buttonEnabled !== undefined && buttonEnabled !== null
					? buttonEnabled
					: true
		});
	}
};
