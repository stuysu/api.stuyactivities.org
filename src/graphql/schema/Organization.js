import { gql } from 'apollo-server-express';

export default gql`
	type Organization {
		id: Int
		name: String!
		url: String!
		active: Boolean!
		locked: String!
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
		groups: [Group]

		charterEdits: [CharterEdit]!
		meetings: [Meeting]
		upcomingMeetings: [Meeting]
		recurringMeetings: [RecurringMeeting]

		joinInstructions: JoinInstructions
		googleCalendar: GoogleCalendar
	}
`;
