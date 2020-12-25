import { gql } from 'apollo-server-express';

export default gql`
	enum CloudinaryImageCropTypes {
		scale
		fit
		limit
		mfit
		pad
		lpad
		fill
		Ifill
		fill_pad
		thumb
	}

	type CloudinaryResource {
		id: String!
		url(
			width: Int
			height: Int
			quality: Float
			crop: CloudinaryImageCropTypes
			background: String
		): String
		height: Int
		width: Int
		resourceType: String
		format: String
		createdAt: DateTime
	}
`;
