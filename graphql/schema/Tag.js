const { gql } = require('apollo-server-express');

module.exports = gql`
	type Tag {
		id: Int
		name: String!
		description: String
	}
`;
