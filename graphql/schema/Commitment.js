const { gql } = require('apollo-server-express');

module.exports = gql`
	type Commitment {
		id: Int!
		organization: Organization
		level: String

		# The number of meetings that happen per month (20 days)
		frequency: Int

		description: String

		days: [String]
	}
`;
