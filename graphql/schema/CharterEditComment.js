const { gql } = require('apollo-server-express');

module.exports = gql`
	type CharterEditComment {
		id: Int
		user: User
		comment: String
	}
`;
