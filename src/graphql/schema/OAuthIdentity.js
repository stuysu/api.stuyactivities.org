import { gql } from 'apollo-server-express';

export default gql`
	type OAuthIdentity {
		id: Int!
		platform: String!
		platformId: String!
		platformEmail: String!
	}
`;
