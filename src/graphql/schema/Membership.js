import { gql } from 'apollo-server-express';

export default gql`
	type Membership {
		id: Int!
		user: User
		organization: Organization
		groupMemberships: [GroupMembership]
		role: String
		adminPrivileges: Boolean
		updatedAt: DateTime
		createdAt: DateTime
		meetingNotification: Boolean
		updateNotification: Boolean
		meetingReminderTime: Int
	}
`;
