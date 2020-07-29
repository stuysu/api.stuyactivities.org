const simpleValidator = require('./../../../utils/simpleValidator');
const { ForbiddenError, ApolloError } = require('apollo-server-express');
const getAvatarUrl = require('./../../../utils/getAvatarUrl');
const randomString = require('crypto-random-string');
const mailer = require('./../../../utils/mailer');
const emailRenderer = require('./../../../utils/emailRenderer');
const HTMLParser = require('node-html-parser');
const urlJoin = require('url-join');
const { PUBLIC_URL } = require('./../../../constants');
const charterValidator = require('./../../../utils/charterValidator');
const uploadPicStream = require('./../../../utils/uploadPicStream');

module.exports = async (root, args, context) => {
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

	const getTags = await Tags.findAll();
	const allTags = getTags.map(tag => tag.id);

	tags = [...new Set(allTags)];

	tags.forEach(tag =>
		simpleValidator(
			tag,
			{
				type: 'number',
				in: allTags
			},
			['tags']
		)
	);

	let actualPicture = charter.picture || getAvatarUrl(name);

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
		appointmentProcedures: charter.appointmentProcedures,
		meetingSchedule: charter.meetingSchedule,
		meetingDays: JSON.stringify(charter.meetingDays),
		meetingFrequency: charter.meetingFrequency,
		commitmentLevel: charter.commitmentLevel,
		keywords: JSON.stringify(charter.keywords),
		extra: charter.extra,
		picture: actualPicture,
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
	leaders = [...new Set(leaders)];

	// Add the other admins and send them an email
	const leaderUsers = await users.findAll({ where: { id: leaders } });
	const joinUrl = urlJoin(PUBLIC_URL, 'organizations', url, 'join');
	for (let i = 0; i < leaderUsers.length; i++) {
		const leader = leaderUsers[i];
		const adminMessage = `${currentUser.firstName} ${currentUser.lastName} is asking you to join as a leader of the organization ${org.name} on StuyActivities.`;

		await membershipRequests.create({
			organizationId: org.id,
			userId: leader.id,
			role: 'Leader',
			adminPrivileges: true,
			userMessage: null,
			adminMessage,
			userApproval: false,
			adminApproval: true
		});

		const htmlMail = emailRenderer.render('orgLeaderInvite.html', {
			invitee: leader,
			inviter: currentUser,
			org,
			joinUrl
		});
		const plainTextMail = HTMLParser.parse(htmlMail).structuredText;

		await mailer.sendMail({
			from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
			to: leader.email,
			subject: `Join Request: ${org.name} | StuyActivities`,
			text: plainTextMail,
			html: htmlMail
		});
	}

	if (charter.picture) {
		const randomName = randomString({ length: 8 });
		const filePublicId = `/organizations/${url}/${randomName}`;

		uploadPicStream(charter.picture, filePublicId).then(image => {
			pendingCharter.picture = image.secure_url;
			pendingCharter.save();
		});
	}

	return org;
};
