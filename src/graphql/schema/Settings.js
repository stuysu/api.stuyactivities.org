import { gql } from 'apollo-server-express';

export default gql`
	type Settings {
		membershipRequirement: Int!
	}
`;
