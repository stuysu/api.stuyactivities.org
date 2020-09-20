import getLinkPreview from '../../../utils/getLinkPreview';

export default (root, { url }, { session }) => {
	session.authenticationRequired(['linkPreview']);

	return getLinkPreview(url);
};
