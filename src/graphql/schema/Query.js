import { gql } from 'apollo-server-express';

export default gql`
	type Query {
		authenticatedUser: User
		charter(id: Int, orgUrl: String, orgId: Int): Charter

		organization(url: String, id: String): Organization
		organizations(
			keyword: String
			tags: [String]
			commitmentLevels: [String]
			meetingDays: [String]
			limit: Int
			offset: Int
			active: Boolean
			pendingCharterEdits: Boolean
		): [Organization]!
		organizationsWithPendingCharters: [Organization]!

		members(orgUrl: String, orgId: Int): [Membership]

		# Returns all tags if no parameters are provided or tags that match the given parameters
		tags(keyword: String, orgId: Int, orgUrl: Int): [Tag]!

		user(email: String, id: Int): User
		users(keyword: String!): [User]!
	}
`;
