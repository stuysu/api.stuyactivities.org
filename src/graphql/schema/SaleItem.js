import { gql } from 'apollo-server-express';

export default gql`
	type SaleItem {
		id: Int!
		item: String!
		price: Int!
	}
`;
