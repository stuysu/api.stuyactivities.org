const { gql } = require('apollo-server-express');

module.exports = gql`
	type OAuthIdentity {
		id: Int!
		platform: String!
		platformId: String!
		platformEmail: String!
	}
`;
