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
import { PUBLIC_URL } from '../../../constants.js';
import charterValidator from '../../../utils/charterValidator';
import uploadPicStream from '../../../utils/uploadPicStream';
import honeybadger from '../../../middleware/honeybadger';

const cloudinary = require('cloudinary').v2;

const URL_BLACKLIST = [
	'charter',
	'catalog',
	'admin',
	'rules',
	'about',
	'help',
	'app',
	'token'
];

export default async (root, args, context) => {
	const {
		authenticationRequired,
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
		},
		user
	} = context;

	authenticationRequired();

	let { name, url, charter, leaders, tags } = args;

	name = name.trim();
	url = url.trim();

	// {{{ Validation
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
					submittingUserId: user.id,
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
			match: '^[a-zA-Z0-9-]+$',
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

	const urlExists =
		URL_BLACKLIST.includes(url) ||
		(await organizations.findOne({
			where: {
				url
			}
		}));

	if (urlExists) {
		throw new ApolloError('That URL is already in use.', 'URL_EXISTS');
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

	// get leader users (also used later to send invitation emails)
	const leaderUsers = await users.findAll({ where: { id: leaders } });
	// }}}

	let actualPicture = await cloudinary.uploader.upload(getAvatarUrl(name), {
		public_id: `organizations/${url}/${cryptoRandomString({
			length: 8
		})}`
	});

	// Now insert into the database
	const org = await organizations.create({
		name,
		url,
		active: false
	});

	const activeCharter = await charters.create({
		organizationId: org.id,
		picture: actualPicture.public_id,
		clubpubParticipant: charter.clubpubParticipant || false
	});

	const pendingCharter = await charterEdits.create({
		mission: charter.mission,
		purpose: charter.purpose,
		benefit: charter.benefit,
		uniqueness: charter.uniqueness,
		appointmentProcedures: charter.appointmentProcedures,
		meetingSchedule: charter.meetingSchedule,
		socials: charter.socials,
		meetingDays: JSON.stringify(charter.meetingDays),
		commitmentLevel: charter.commitmentLevel,
		keywords: JSON.stringify(charter.keywords),
		extra: charter.extra,
		picture: null,
		status: 'pending',
		submittingUserId: user.id,
		organizationId: org.id
	});

	await memberships.create({
		organizationId: org.id,
		userId: user.id,
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

	// Add the other admins and send them an email (leader user-getting code was moved to validation section)
	const joinUrl = urlJoin(PUBLIC_URL, url, 'join');
	for (let i = 0; i < leaderUsers.length; i++) {
		const leader = leaderUsers[i];
		const adminMessage = `${user.firstName} ${user.lastName} is asking you to join as a leader of the organization ${org.name} on StuyActivities.`;

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
			subject: `Confirm Leadership of ${org.name} | StuyActivities`,
			template: 'orgLeaderInvite.html',
			variables: {
				invitee: leader,
				inviter: user,
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
				pendingCharter.picture = image.public_id;
				pendingCharter.save();
			})
			.catch(honeybadger.notify);
	}

	return org;
};
