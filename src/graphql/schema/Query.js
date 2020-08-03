import { gql } from 'apollo-server-express';

export default gql`
	type Query {
		user(email: String, id: Int): User
		users(keyword: String!): [User]!
		authenticatedUser: User
		resetTokenIsValid(token: String!): Boolean!
		organizations(
			keyword: String
			tags: [String]
			commitmentLevels: [String]
			meetingDays: [String]
			limit: Int! = 50
			offset: Int! = 0
			active: Boolean
			pendingCharterEdits: Boolean
		): [Organization]!
		organization(url: String, id: String): Organization
		charter(orgUrl: String, orgId: Int): Charter
		members(orgUrl: String, orgId: Int): [Membership]
		organizationsWithPendingCharters: [Organization]!

		tags(keyword: String): [Tag]!
	}
`;
