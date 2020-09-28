import { gql } from 'apollo-server-express';

export default gql`
	type UpdatePic {
		id: Int
		publicId: String
		description: String
		width: Int
		height: Int
		mimetype: String
		defaultUrl: String
	}
`;
