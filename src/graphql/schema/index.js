import { typeDefs as graphqlScalarDefs } from 'graphql-scalars';
import AdminRole from './AdminRole';
import Charter from './Charter';
import CharterApprovalMessage from './CharterApprovalMessage';
import CharterEdit from './CharterEdit';
import CloudinaryResource from './CloudinaryResource';
import ClubFairResponse from './ClubFairResponse';
import GoogleCalendar from './GoogleCalendar';
import HelpRequest from './HelpRequest';
import HelpRequestMessage from './HelpRequestMessage';
import JoinInstructions from './JoinInstructions';
import KeyPair from './KeyPair';
import LinkPreview from './LinkPreview';
import Meeting from './Meeting';
import Membership from './Membership';
import MembershipRequest from './MembershipRequest';
import Mutation from './Mutation';
import OAuthIdentity from './OAuthIdentity';
import Organization from './Organization';
import Query from './Query';
import Strike from './Strike';
import Tag from './Tag';
import Update from './Update';
import UpdateApprovalMessage from './UpdateApprovalMessage';
import UpdateQuestion from './UpdateQuestion';
import Upload from './Upload';
import User from './User';

export default [
	...graphqlScalarDefs,
	AdminRole,
	Charter,
	CharterApprovalMessage,
	CharterEdit,
	CloudinaryResource,
	ClubFairResponse,
	GoogleCalendar,
	HelpRequest,
	HelpRequestMessage,
	JoinInstructions,
	KeyPair,
	LinkPreview,
	Meeting,
	Membership,
	MembershipRequest,
	Mutation,
	OAuthIdentity,
	Organization,
	Query,
	Strike,
	Tag,
	Update,
	UpdateApprovalMessage,
	UpdateQuestion,
	Upload,
	User
];
