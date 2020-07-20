const { gql } = require('apollo-server-express');

module.exports = gql`
	type Organization {
		id: Int
		name: String!
		url: String!
		picture: String
		active: Boolean!
		createdAt: String!
		tags: [Tag]!

		charter: Charter
	}
`;
