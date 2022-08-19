import { gql } from 'apollo-server-express';

export default gql`
	type PromotedClub {
		id: Int!
		organization: Organization!
		blurb: String
	}
`;
