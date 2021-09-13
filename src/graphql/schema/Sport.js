import { gql } from 'apollo-server-express';

export default gql`
	type Sport {
		id: Int!
		name: String
		picture: CloudinaryResource
		captains: [SportsCaptain]
		coach: String
		coachEmail: String
		tryouts: String
		commitment: String
		schedule: String
		experience: String
		equipment: String
		moreInfo: String
	}
`;
