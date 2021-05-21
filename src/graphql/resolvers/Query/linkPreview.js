import getLinkPreview from '../../../utils/getLinkPreview';

export default (root, { url }, { authenticationRequired }) => {
	authenticationRequired();

	return getLinkPreview(url);
};
