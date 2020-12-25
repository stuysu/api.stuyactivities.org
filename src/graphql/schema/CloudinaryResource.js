import { gql } from 'apollo-server-express';

export default gql`
	type CloudinaryResource {
		id: String!
		url(width: Int, height: Int, quality: Float): String
		height: Int
		width: Int
		resourceType: String
		format: String
		createdAt: DateTime
	}
`;
