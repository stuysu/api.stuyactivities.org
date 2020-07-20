const { gql } = require('apollo-server-express');

module.exports = gql`
	type Charter {
		mission: String
		purpose: String
		meetingsFrequency: String
		benefit: String
		appointmentProcedures: String
		uniqueness: String
		extra: String
	}
`;
