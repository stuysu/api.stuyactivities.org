import { gql } from 'apollo-server-express';

export default gql`
	type LinkPreview {
		id: Int
		url: String
		title: String
		description: String
		image: String
		siteName: String
	}
`;
