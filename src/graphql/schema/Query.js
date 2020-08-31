import { gql } from 'apollo-server-express';

export default gql`
	type Query {
		authenticatedUser: User
		charter(id: Int, orgUrl: String, orgId: Int): Charter

		organization(url: String, id: Int): Organization
		organizations(
			keyword: String
			tags: [Int!]
			commitmentLevels: [String!]
			meetingDays: [String!]
			limit: Int
			offset: Int
			active: Boolean
			pendingCharterEdits: Boolean
		): [Organization]!
		organizationsWithPendingCharters: [Organization]!

		memberships(orgUrl: String, orgId: Int): [Membership]
		membershipRequests(orgUrl: String, orgId: Int): [MembershipRequest]

		# Returns all tags if no parameters are provided or tags that match the given parameters
		tags(keyword: String, orgId: Int, orgUrl: Int): [Tag]!

		user(email: String, id: Int): User
		users(keyword: String!, offset: Int, limit: Int): [User]!

		helpRequests(
			userId: Int
			honeybadgerId: String
			status: String
			path: String
			ipAddress: String
		): [HelpRequest]
		helpRequest(requestId: Int!): HelpRequest
	}
`;
