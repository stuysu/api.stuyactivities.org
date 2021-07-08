import { resolvers as graphqlScalarResolvers } from 'graphql-scalars';
import AdminRole from './AdminRole';
import Charter from './Charter';
import CharterApprovalMessage from './CharterApprovalMessage';
import CharterEdit from './CharterEdit';
import CloudinaryResource from './CloudinaryResource';
import GoogleCalendar from './GoogleCalendar';
import JoinInstructions from './JoinInstructions';
import Meeting from './Meeting';
import Membership from './Membership';
import MembershipRequest from './MembershipRequest';
import Mutation from './Mutation';
import Organization from './Organization';
import Query from './Query';
import Strike from './Strike';
import Update from './Update';
import UpdateApprovalMessage from './UpdateApprovalMessage';
import UpdateQuestion from './UpdateQuestion';
import Upload from './Upload';
import User from './User';

const resolvers = {
	...graphqlScalarResolvers,
	AdminRole,
	Charter,
	CharterApprovalMessage,
	CharterEdit,
	CloudinaryResource,
	GoogleCalendar,
	JoinInstructions,
	Meeting,
	Membership,
	MembershipRequest,
	Mutation,
	Organization,
	Query,
	Strike,
	Update,
	UpdateApprovalMessage,
	UpdateQuestion,
	Upload,
	User
};

export default resolvers;
