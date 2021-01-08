import { gql } from 'apollo-server-express';

export default gql`
	type UpdatePic {
		id: Int
		publicId: String
		description: String
		width: Int
		height: Int
		url(
			width: Int
			height: Int
			quality: Float
			crop: CloudinaryImageCropTypes
			background: String
		): String
		mimetype: String
		defaultUrl: String
	}
`;
