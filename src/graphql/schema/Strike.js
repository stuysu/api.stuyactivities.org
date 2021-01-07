import { gql } from 'apollo-server-express';

export default gql`
	type Strike {
		id: Int!
		strikeComments: [StrikeComment]
		organization: Organization
		organizationId: Int
		weight: Int
		reviewer: User
		reviewerId: Int
		reason: String
		createdAt: DateTime
	}
`;
