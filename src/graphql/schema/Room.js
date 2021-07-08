import { gql } from 'apollo-server-express';
export default gql`
	type Room {
		id: Int!
		name: NonEmptyString!
		floor: NonNegativeInt!
		approvalRequired: Boolean!
	}
`;
