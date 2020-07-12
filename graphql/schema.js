const { gql } = require('apollo-server-express');

const typeDefs = gql`
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

	input UserSearch {
		id: Int
		email: String
	}

	type Query {
		user(where: UserSearch!): User
	}

	input StdLoginParams {
		email: String!
		password: String!
	}

	input LoginTypes {
		where: StdLoginParams
		googleOAuthToken: String
	}

	type Mutation {
		login(where: LoginTypes): User!
	}
`;
module.exports = typeDefs;
