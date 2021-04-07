import { gql } from 'apollo-server-express';

export default gql`
	type Query {
		authenticatedUser: User
		charter(id: Int, orgUrl: String, orgId: Int): Charter @deprecated
		charterById(id: Int!): Charter
		charterByOrgId(orgId: Int!): Charter
		charterByOrgUrl(orgUrl: String!): Charter

		organization(url: String, id: Int): Organization @deprecated
		organizationById(id: Int!): Organization
		organizationByUrl(url: String!): Organization
		organizations(
			keyword: String
			tags: [Int!]
			commitmentLevels: [String!]
			meetingDays: [String!]
			limit: Int
			offset: Int
			active: Boolean
			randomOrderSeed: Int
		): [Organization]!

		organizationsWithPendingCharters: [Organization]
		charterEdits(orgId: Int, status: String): [CharterEdit]

		memberships(orgUrl: String, orgId: Int): [Membership]
		membershipRequests(orgId: Int!): [MembershipRequest]

		# Returns all tags if no parameters are provided or tags that match the given parameters
		tags(keyword: String, orgId: Int, orgUrl: Int): [Tag]!

		user(email: String, id: Int): User @deprecated
		userById(id: Int!): User
		userByEmail(email: String!): User
		users(keyword: String!, offset: Int, limit: Int): [User]!

		helpRequests(
			userId: Int
			honeybadgerId: String
			status: String
			path: String
			ipAddress: String
		): [HelpRequest]
		helpRequest(requestId: Int!): HelpRequest

		linkPreview(url: String!): LinkPreview

		clubFairResponse(orgId: Int!): ClubFairResponse

		exploreUpdates(limit: Int = 20, offset: Int): [Update]
		exploreMeetings: [Meeting]

		upcomingUserMeetings(userId: Int!): [Meeting!]
		userUpdates(userId: Int!): [Update]

		meetings(start: DateTime!, end: DateTime!, limit: Int): [Meeting]
		meetingsByOrganizationId(
			organizationId: Int!
			start: DateTime
			end: DateTime
		): [Meeting!]!

		meetingById(id: Int!): Meeting

		date: DateTime!
	}
`;
