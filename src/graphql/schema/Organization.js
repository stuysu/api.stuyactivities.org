import { gql } from 'apollo-server-express';

export default gql`
	type Organization {
		id: Int
		name: String!
		url: String!
		active: Boolean!
		createdAt: DateTime
		updatedAt: DateTime
		tags: [Tag]!
		charter: Charter
		strikes: [Strike]

		charterApprovalMessages: [CharterApprovalMessage]
		memberships(onlyLeaders: Boolean = false): [Membership]
		membership: Membership
		membershipRequest: MembershipRequest
		membershipRequests: [MembershipRequest]

		updates: [Update]

		charterEdits: [CharterEdit]!
		meetings: [Meeting]
		upcomingMeetings: [Meeting]
	}
`;
