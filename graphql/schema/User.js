const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		id: Int!
		name: String!
		firstName: String!
		lastName: String!
		email: String!
		gradYear: Int
		grade: Int
		isFaculty: Boolean!
	}
`;
