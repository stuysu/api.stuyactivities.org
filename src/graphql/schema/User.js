import { gql } from 'apollo-server-express';

export default gql`
	type User {
		id: Int!
		name: String!
		firstName: String!
		lastName: String!
		email: String
		gradYear: Int
		grade: Int
		isFaculty: Boolean!
		adminRoles: [AdminRole]!
		oAuths: [OAuthIdentity]!
		picture: String
		fourDigitId: Int
		helpRequests: [HelpRequest]

		# Can only be accessed by the user themselves or someone with admin privileges
		memberships: [Membership]
	}
`;
