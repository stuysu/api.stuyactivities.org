import { gql } from 'apollo-server-express';

export default gql`
	"""
	Private key is not accessible through GraphQL for obvious reasons
	"""
	type KeyPair {
		publicKey: String!
		expiration: DateTime!
	}
`;
