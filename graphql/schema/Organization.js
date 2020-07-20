const { gql } = require('apollo-server-express');

module.exports = gql`
	type Organization {
		id: Int
		name: String!
		url: String!
		picture: String
		active: Boolean!
		commitmentLevel: String
		createdAt: String!
		tags: [Tag]!

		charter: Charter
	}
`;
