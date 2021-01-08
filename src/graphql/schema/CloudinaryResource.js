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
		thumb
	}

	enum CloudinaryGravityTypes {
		north_east
		north
		north_west
		west
		south_west
		south
		south_east
		east
		center
		auto
	}

	type CloudinaryResource {
		id: String!
		url(
			width: Int
			height: Int
			quality: Float
			crop: CloudinaryImageCropTypes
			background: String
			radius: Int
			gravity: CloudinaryGravityTypes
		): String
		thumbnail(width: Int!, height: Int!): String
		height: Int
		width: Int
		resourceType: String
		format: String
		createdAt: DateTime
	}
`;
