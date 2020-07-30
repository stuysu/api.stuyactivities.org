module.exports = (root, args, { session }) => {
	session.destroy();
	return true;
};
