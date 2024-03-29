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
		returningInfo: String
		commitmentLevel: String
		keywords: [String!]
		extra: String
		picture: Upload
		socials: String
		clubpubParticipant: Boolean
	}

	input LeaderParams {
		userId: Int!
		role: String!
	}

	enum updateTypes {
		private
		public
	}

	type Mutation {
		# --- Auth fields ---

		login(loginToken: String, googleToken: String): JWT!
		requestLoginToken(email: String!): Void
		linkOAuthPlatform(platform: String!, token: String!): OAuthIdentity
		logout: Void

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
		createOutgoingRequest(
			orgId: Int
			orgUrl: String
			userId: Int!
			message: String
			admin: Boolean
			role: String
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

		alterEmailSettings(
			membershipId: Int!
			meetingNotification: Boolean
			updateNotification: Boolean
			meetingReminderTime: Int
		): Membership

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
			roomId: Int
			groupId: Int
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

		addRoomToMeeting(meetingId: Int!, roomId: Int!): Meeting!
		removeRoomFromMeeting(meetingId: Int!, roomId: Int!): Meeting!

		createMeetings(
			orgId: Int
			orgUrl: String
			title: String!
			description: String!
			start: DateTime!
			end: DateTime!
			weeks: Int!
			privacy: String! = "public"
			notifyFaculty: Boolean
			roomId: Int
			groupId: Int
		): [Meeting]

		# --- RecurringMeeting fields ---
		createRecurringMeeting(
			orgId: Int
			orgUrl: String
			title: String!
			description: String!
			start: Time!
			end: Time!
			dayOfWeek: Int!
			frequency: Int!
			privacy: String! = "public"
		): RecurringMeeting
		alterRecurringMeeting(
			recurringMeetingId: Int!
			title: String
			description: String
			start: Time
			end: Time
			dayOfWeek: Int
			notifyMembers: Boolean
			privacy: String
			frequency: Int
		): RecurringMeeting
		deleteRecurringMeeting(recurringMeetingId: Int!): Boolean

		# --- Groups ---
		createGroup(orgId: Int!, name: String!): Group
		deleteGroup(groupId: Int!): Boolean
		createGroupMembership(groupId: Int!, userId: Int!): GroupMembership
		deleteGroupMembership(groupMembershipId: Int!): Boolean

		# --- Promoted Clubs ---
		alterPromotedClub(
			promotedClubId: Int!
			orgId: Int
			blurb: String
		): PromotedClub
		createPromotedClub(orgId: Int!, blurb: String!): PromotedClub
		deletePromotedClub(promotedClubId: Int!): Boolean

		# --- admin ---
		adminDeleteMeeting(meetingId: Int!): Boolean
		alterSettings(membershipRequirement: Int!): Settings

		# --- users ---
		createUser(email: String!, isFaculty: Boolean!): User

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
			type: updateTypes!
			title: NonEmptyString!
			content: NonEmptyString!
			notifyMembers: Boolean
			notifyFaculty: Boolean
			localPinned: Boolean
		): Update!

		alterUpdate(
			id: Int!
			type: updateTypes!
			title: NonEmptyString!
			content: NonEmptyString!
			notifyMembers: Boolean!
			notifyFaculty: Boolean!
			localPinned: Boolean!
		): Update!

		deleteUpdate(updateId: Int!): Boolean

		createUpdateQuestion(updateId: Int!, question: String!): UpdateQuestion

		answerUpdateQuestion(
			updateQuestionId: Int!
			answer: String!
			private: Boolean!
		): UpdateQuestion

		deleteUpdateQuestion(updateQuestionId: Int!): Boolean

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

		uploadImage(alt: String!, file: Upload!): CloudinaryResource!
		emailClubLeaders(subject: String!, body: String!): Boolean

		recordBoogramPurchase(
			userId: Int!
			oneDollarCount: Int!
			twoDollarCount: Int!
		): Boolean

		recordSales(
			userId: Int!
			purchaserOsis: Int!
			purchases: [Int!]!
			counts: [Int!]!
		): Boolean
	}
`;
