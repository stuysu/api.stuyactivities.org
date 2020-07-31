export default (root, args, context) => {
	if (context.session.signedIn) {
		return context.models.users.findOne({
			where: { id: context.session.userId }
		});
	}

	return null;
};
