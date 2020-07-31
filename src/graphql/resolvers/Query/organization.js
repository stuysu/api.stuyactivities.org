import { UserInputError } from 'apollo-server-express';
export default (root, args, context) => {
	const { id, url } = args;
	const {
		models: { organizations, memberships, users, tags, charters }
	} = context;

	if (!id && !url) {
		throw new UserInputError(
			'You must pass a url or an id to query an organization.',
			{
				invalidArgs: ['id', 'url']
			}
		);
	}

	const include = [
		{
			model: memberships,
			include: users
		},
		{ model: tags },
		{ model: charters }
	];

	if (id) {
		return organizations.findOne({ where: { id }, include });
	}

	if (url) {
		return organizations.findOne({ where: { url }, include });
	}
};
