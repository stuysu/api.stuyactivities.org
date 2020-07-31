export default (root, args, { session }) => {
	session.destroy();
	return true;
};
