import { gql } from 'apollo-server-express';

export default gql`
	type Update {
		id: Int!
		organizationId: Int
		submittingUserId: Int
		title: String
		content: String
		type: String
		approved: Boolean
		localPinned: Boolean
		globalPinned: Boolean
		createdAt: DateTime

		# These are custom properties
		organization: Organization
		submittingUser: User
		links: [LinkPreview]
		pictures: [UpdatePic]
	}
`;
