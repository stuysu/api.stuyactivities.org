import simpleValidator from '../../../utils/simpleValidator';
import {
	ApolloError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-express';
import getAvatarUrl from '../../../utils/getAvatarUrl';
import cryptoRandomString from 'crypto-random-string';
import sendEmail from '../../../utils/sendEmail';

import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';
import charterValidator from '../../../utils/charterValidator';
import uploadPicStream from '../../../utils/uploadPicStream';
import honeybadger from '../../../middleware/honeybadger';

const cloudinary = require('cloudinary').v2;

export default async (root, args, context) => {
	const {
		session,
		models: {
			organizations,
			charterEdits,
			charters,
			users,
			tags: Tags,
			orgTags,
			memberships,
			membershipRequests,
			Sequelize: { Op }
		}
	} = context;

	session.authenticationRequired(['createOrganization']);

	let { name, url, charter, leaders, tags } = args;

	name = name.trim();
	url = url.trim();

	const currentUser = await users.findOne({ where: { id: session.userId } });

	// MAKE SURE THE USER HAS NOT ALREADY SUBMITTED 2 PENDING CHARTERS
	const now = new Date();
	const oneWeek = 1000 * 60 * 60 * 24 * 7;
	const oneWeekAgo = new Date(now.getTime() - oneWeek);

	// The number of pending charters submitted in the last week. Max: 2
	const numPendingChartersSubmitted = await organizations.count({
		where: {
			active: false,
			createdAt: {
				[Op.gte]: oneWeekAgo
			}
		},
		include: [
			{
				model: charterEdits,
				where: {
					submittingUserId: currentUser.id,
					status: 'pending'
				}
			}
		]
	});

	if (numPendingChartersSubmitted >= 2) {
		// Throw a forbidden error
		throw new ForbiddenError(
			'You cannot submit more than 2 pending charters in the same week.'
		);
	}

	simpleValidator(
		url,
		{
			type: 'string',
			match: '^[a-z0-9-]+$',
			characters: {
				min: 1
			}
		},
		['url']
	);

	simpleValidator(
		name,
		{
			characters: {
				min: 1
			}
		},
		['name']
	);

	const urlExists = await organizations.findOne({
		where: {
			url
		}
	});

	if (urlExists) {
		throw new ApolloError(
			'There is already an organization with that url.',
			'URL_EXISTS'
		);
	}

	if (charter.picture) {
		charter.picture = await charter.picture;
	}

	charter.meetingDays = [...new Set(charter.meetingDays)].map(i =>
		i.toLowerCase()
	);

	if (charter.commitmentLevel) {
		charter.commitmentLevel = charter.commitmentLevel.toLowerCase();
	}

	charter.keywords = [...new Set(charter.keywords)]
		.filter(Boolean)
		.map(i => i.toLowerCase());

	// Start the charter verification here:
	Object.keys(charter).forEach(field =>
		charterValidator(field, charter[field])
	);

	const getTags = await Tags.findAll({
		where: {
			id: tags
		}
	});

	tags = getTags.map(tag => tag.id);
	if (!tags.length) {
		throw new UserInputError('You must provide at least one tag.', {
			invalidArgs: ['tags']
		});
	}

	if (tags.length > 3) {
		throw new UserInputError('You cannot select more than 3 tags.', {
			invalidArgs: ['tags']
		});
	}

	let actualPicture = getAvatarUrl(name);

	// Now insert into the database
	const org = await organizations.create({
		name,
		url,
		active: false
	});

	const activeCharter = await charters.create({
		organizationId: org.id,
		picture: actualPicture
	});

	const pendingCharter = await charterEdits.create({
		mission: charter.mission,
		purpose: charter.purpose,
		benefit: charter.benefit,
		uniqueness: charter.uniqueness,
		appointmentProcedures: charter.appointmentProcedures,
		meetingSchedule: charter.meetingSchedule,
		meetingDays: JSON.stringify(charter.meetingDays),
		commitmentLevel: charter.commitmentLevel,
		keywords: JSON.stringify(charter.keywords),
		extra: charter.extra,
		picture: null,
		status: 'pending',
		submittingUserId: currentUser.id,
		organizationId: org.id
	});

	await memberships.create({
		organizationId: org.id,
		userId: currentUser.id,
		role: 'Creator',
		adminPrivileges: true
	});

	// Create the tags
	for (let i = 0; i < tags.length; i++) {
		await orgTags.create({
			organizationId: org.id,
			tagId: tags[i]
		});
	}

	// Remove any duplicates from leaders
	const leaderRoles = {};

	leaders = [
		...new Set(
			leaders.map(leader => {
				leaderRoles[leader.userId] = leader.role;
				return leader.userId;
			})
		)
	];

	// Add the other admins and send them an email
	const leaderUsers = await users.findAll({ where: { id: leaders } });
	const joinUrl = urlJoin(PUBLIC_URL, 'organizations', url, 'join');
	for (let i = 0; i < leaderUsers.length; i++) {
		const leader = leaderUsers[i];
		const adminMessage = `${currentUser.firstName} ${currentUser.lastName} is asking you to join as a leader of the organization ${org.name} on StuyActivities.`;

		await membershipRequests.create({
			organizationId: org.id,
			userId: leader.id,
			role: leaderRoles[leader.id] || 'Leader',
			adminPrivileges: true,
			userMessage: null,
			adminMessage,
			userApproval: false,
			adminApproval: true
		});

		await sendEmail({
			to: leader.email,
			subject: `Join Request: ${org.name} | StuyActivities`,
			template: 'orgLeaderInvite.html',
			variables: {
				invitee: leader,
				inviter: currentUser,
				org,
				joinUrl
			}
		});
	}

	if (charter.picture) {
		const randomName = cryptoRandomString({ length: 8 });
		const filePublicId = `organizations/${url}/${randomName}`;

		uploadPicStream(charter.picture, filePublicId)
			.then(image => {
				const options = {
					quality: 90,
					secure: true
				};

				if (image.width > image.height) {
					options.width = 600;
				} else {
					options.height = 600;
				}

				pendingCharter.picture = cloudinary.url(
					image.public_id,
					options
				);
				pendingCharter.save();
			})
			.catch(honeybadger.notify);
	}

	return org;
};
