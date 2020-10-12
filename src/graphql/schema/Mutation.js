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

	input UpdatePicUpload {
		file: Upload!
		description: String!
	}

	type Mutation {
		# --- Auth fields ---

		login(loginToken: String, googleToken: String): User!
		requestLoginToken(email: String!): Boolean
		linkOAuthPlatform(platform: String!, token: String!): OAuthIdentity
		logout: Boolean

		# --- Chartering fields ---

		createOrganization(
			name: String!
			url: String!
			charter: CharterParams!
			tags: [Int!]!
			# String of emails
			leaders: [LeaderParams!]!
		): Organization
		alterCharter(
			orgId: Int!
			# In case the new changes conflict with changes that were already proposed
			force: Boolean = false
			charter: CharterParams!
		): CharterEdit
		approveCharterFields(
			charterEditId: Int!
			fields: [String!]!
		): CharterEdit
		rejectCharterFields(charterEditId: Int!, fields: [String]!): CharterEdit
		createCharterApprovalMessage(
			orgId: Int!
			message: String!
		): CharterApprovalMessage

		# --- Strike fields ---

		createStrike(
			orgId: Int
			orgUrl: String
			weight: Int!
			reason: String!
		): Strike

		# --- Membership fields ---

		createMembershipRequest(
			orgId: Int
			orgUrl: String
			message: String
		): MembershipRequest
		deleteMembershipRequest(requestId: Int!): Boolean
		approveMembershipRequest(requestId: Int!): MembershipRequest
		alterMembership(
			membershipId: Int!
			adminPrivileges: Boolean
			role: String
			notify: Boolean
			privacy: String
		): Membership
		deleteMembership(membershipId: Int!, notify: Boolean): Boolean

		# --- Meeting fields ---
		createMeeting(
			orgId: Int
			orgUrl: String
			title: String!
			description: String!
			start: DateTime!
			end: DateTime!
			privacy: String! = "public"
			notifyFaculty: Boolean
		): Meeting
		alterMeeting(
			meetingId: Int!
			title: String
			description: String
			start: DateTime
			end: DateTime
			notifyMembers: Boolean
			privacy: String
		): Meeting
		deleteMeeting(meetingId: Int!): Boolean

		# --- Help Requests ---
		createHelpRequest(
			email: String
			title: String!
			description: String!
			captchaToken: String!
			honeybadgerId: String
			path: String
		): HelpRequest
		closeHelpRequest(requestId: Int!): Boolean
		# alterHelpRequest meant only for admin use
		alterHelpRequest(
			requestId: Int!
			title: String
			description: String
			status: String
			honeybadgerId: String
			path: String
		): HelpRequest
		createHelpRequestMessage(
			requestId: Int!
			message: String!
		): HelpRequestMessage

		# Updates
		createUpdate(
			orgId: Int!
			type: String!
			title: String!
			content: String!
			notifyMembers: Boolean
			notifyFaculty: Boolean
			localPinned: Boolean
			links: [String!]
			pictures: [UpdatePicUpload!]
		): Update

		deleteUpdate(updateId: Int!): Boolean

		alterClubFairResponse(
			orgId: Int!
			isAttending: Boolean!
			meetingLink: String
		): ClubFairResponse

		alterJoinInstructions(
			orgId: Int!
			instructions: String
			buttonEnabled: Boolean
		): JoinInstructions
	}
`;
