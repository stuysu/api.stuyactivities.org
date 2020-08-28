import {ApolloError, UserInputError, ForbiddenError} from "apollo-server-express"
import isClubAdmin from "../../../utils/isClubAdmin"
import sendEmail from "../../../utils/sendEmail"

export default async (parent, args, context) => {
	const {adminPrivileges, role, orgId, userId} = args;
	const {session, models: {memberships}} = context

	if ((!orgId || !userId) || (adminPrivileges === undefined && !role)) {
		throw new UserInputError(
			"The organizationID, userID, and at least one of the adminPrivileges and role are required to alter a membership!",
			{invalidArgs: ["orgId", "userId", "adminPrivileges", "role"]}
		)
	}

	//see if user is an admin
	if (!isClubAdmin(session.userId, orgId, memberships)) {
		throw new ForbiddenError("You do not have the right to alter a membership in this club!")
	}
	const membership = await memberships.findOne({
		where: {
			organizationId: orgId, userId
		}
	})
	if (!membership) {
		throw new ApolloError(
			"Could not find a membership with that userId and that orgId",
			"MEMBERSHIP_NOT_FOUND"
		)
	}
	const updateObj = {}
	if (adminPrivileges !== undefined) {
		updateObj.adminPrivileges = adminPrivileges
	}
	if (role) {
		updateObj.role = role
	}
	memberships.update(updateObj, {
		where: {organizationId: orgId, userId}
	})

	const user = await membership.getUser()
	const organization = await membership.getOrganization()
	await sendEmail({
		to: user.email,
		subject: "A club membership of yours has been altered",
		template: "memberAltered.html",
		variables: {
			membership,
			user,
			organization,
		}
	})


	// TODO: Should there not be another request to the database like it is now or can it be avoided?
	return await memberships.findOne({
		where: {
			organizationId: orgId, userId
		}
	})
}
