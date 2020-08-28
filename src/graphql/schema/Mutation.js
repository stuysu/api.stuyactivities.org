import { gql } from 'apollo-server-express';

export default gql`
	input StdLoginParams {
		email: String!
		password: String!
	}

	input CharterParams {
		mission: String
		purpose: String
		benefit: String
		appointmentProcedures: String
		uniqueness: String
		meetingSchedule: String
		meetingDays: [String!]
		commitmentLevel: String
		keywords: [String!]
		extra: String
		picture: Upload
	}

	input LeaderParams {
		userId: Int!
		role: String!
	}

	type Mutation {
		login(loginToken: String, googleToken: String): User!
		logout: Boolean

		createOrganization(
			name: String!
			url: String!
			charter: CharterParams!
			tags: [Int!]!
			# String of emails
			leaders: [LeaderParams!]!
		): Organization

		alterCharter(
			# Either the orgUrl or orgId must be provided
			orgUrl: String
			orgId: Int

			# In case the new changes conflict with changes that were already proposed
			force: Boolean = false

			charter: CharterParams!
		): CharterEdit

		approveCharterFields(
			charterEditId: Int!
			fields: [String!]!
		): CharterEdit

		rejectCharterFields(charterEditId: Int!, fields: [String]!): CharterEdit

		requestLoginToken(email: String!): Boolean

		linkOAuthPlatform(platform: String!, token: String!): OAuthIdentity

		createCharterApprovalMessage(
			orgId: Int!
			message: String!
		): CharterApprovalMessage

		# Give an organization a strike using either the orgId or orgUrl
		createStrike(
			orgId: Int
			orgUrl: Int
			weight: Int!
			reason: String!
		): Strike

		createMembershipRequest(
			orgId: Int
			orgUrl: String
			message: String
		): MembershipRequest

		deleteMembershipRequest(orgId: Int, orgUrl: String): Boolean

		acceptMembershipRequest(requestId: Int!): MembershipRequest

		rejectMembershipRequest(
			requestId: Int!
			message: String
		): MembershipRequest

		createMeeting(
			orgId: Int
			orgUrl: String
			title: String!
			description: String!
			start: String!
			end: String!
		): Meeting

		alterMeeting(
			meetingId: Int!
			title: String
			description: String
			start: String
			end: String
		): Meeting

		deleteMeeting(meetingId: Int!): Boolean
	}
`;
