import { ForbiddenError } from 'apollo-server-express';

export default async (
	root,
	{ groupId, userId },
	{ orgAdminRequired, models: { groups, groupMemberships }, user }
) => {
	if (!groupId || !userId) {
		throw new UserInputError('You must provide group user IDs.', {
			invalidArgs: ['createGroupMembership']
		});
	}

	const group = await groups.idLoader.load(groupId);

	if (!group) {
		throw new ApolloError("There's no group with that id.", 'ID_NOT_FOUND');
	}

	orgAdminRequired(group.organizationId);

	const alreadyMember = await groupMemberships.findOne({
		where: {
			groupId,
			userId
		}
	});

	if (alreadyMember) {
		throw new ForbiddenError('You are already a member of this group');
	}

	return await groupMemberships.create({
		groupId,
		userId
	});
};
