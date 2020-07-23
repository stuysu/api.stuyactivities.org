const simpleValidator = require('./../../../utils/simpleValidator');
const {
	ForbiddenError,
	UserInputError,
	ApolloError
} = require('apollo-server-express');
const getAvatarUrl = require('./../../../utils/getAvatarUrl');
const cloudinary = require('cloudinary').v2;
const randomString = require('crypto-random-string');
const mailer = require('./../../../utils/mailer');
const emailRenderer = require('./../../../utils/emailRenderer');
const HTMLParser = require('node-html-parser');
const urlJoin = require('url-join');
const { PUBLIC_URL } = require('./../../../constants');

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
			Sequelize: { Op }
		}
	} = context;

	session.authenticationRequired(['createOrganization']);

	let {
		name,
		url,
		charter,
		leaders,
		memberships,
		membershipRequests,
		tags,
		photo
	} = args;

	let picFile;

	if (photo) {
		picFile = await photo;

		if (!picFile.mimetype.startsWith('image/')) {
			throw new UserInputError(
				'Only image files can be uploaded as the picture.',
				{
					invalidArgs: ['picture']
				}
			);
		}
	}

	name = name.trim();
	url = url.trim();

	const currentUser = await users.findOne({ where: { id: session.userId } });

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
			active: true,
			url
		}
	});

	if (urlExists) {
		throw new ApolloError(
			'There is already an organization with that url.',
			'URL_EXISTS'
		);
	}

	// Start the charter verification here:
	simpleValidator(
		charter.mission,
		{
			type: 'string',
			characters: { min: 20, max: 150 }
		},
		['mission']
	);

	simpleValidator(
		charter.purpose,
		{
			type: 'string',
			words: { min: 150, max: 400 }
		},
		['purpose']
	);

	simpleValidator(
		charter.benefit,
		{
			type: 'string',
			words: { min: 200, max: 400 }
		},
		['benefit']
	);

	simpleValidator(
		charter.appointmentProcedures,
		{
			type: 'string',
			words: { min: 150, max: 400 }
		},
		['appointmentProcedures']
	);

	simpleValidator(
		charter.uniqueness,
		{
			type: 'string',
			words: {
				min: 75,
				max: 400
			}
		},
		['uniqueness']
	);

	simpleValidator(
		charter.extra,
		{
			type: 'string',
			characters: { max: 1000 }
		},
		['extra']
	);

	simpleValidator(
		charter.meetingSchedule,
		{
			type: 'string',
			characters: {
				min: 5,
				max: 200
			}
		},
		['meetingSchedule']
	);

	if (!charter.meetingDays) {
		throw new UserInputError(
			'You must include days that your club has meetings.',
			{ invalidArgs: ['meetingDays'] }
		);
	}

	const allowedDays = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday'
	];

	// First remove duplicates and then make the array items lowercase
	charter.meetingDays = [...new Set(charter.meetingDays)].map(i =>
		i.toLowerCase()
	);

	charter.meetingDays.forEach(input =>
		simpleValidator(
			input,
			{
				type: 'string',
				in: allowedDays
			},
			['meetingDays']
		)
	);

	if (charter.commitmentLevel) {
		charter.commitmentLevel = charter.commitmentLevel.toLowerCase();
	}

	simpleValidator(
		charter.commitmentLevel,
		{
			type: 'string',
			in: ['low', 'medium', 'high']
		},
		['commitmentLevel']
	);

	if (!charter.keywords) {
		throw new UserInputError(
			'You must include keywords relating to your club.',
			{ invalidArgs: ['keywords'] }
		);
	}

	charter.keywords = [...new Set(charter.keywords)].filter(Boolean);

	if (charter.keywords.length > 3) {
		throw new UserInputError('You can only specify a max of 3 keywords.', {
			invalidArgs: ['keywords']
		});
	}

	const getTags = await Tags.findAll();
	const allTags = getTags.map(tag => tag.id);

	tags = [...new Set(tags)].map(tag => tag.id);

	tags.forEach(tag =>
		simpleValidator(
			tag,
			{
				type: 'integer',
				in: allTags
			},
			['tags']
		)
	);

	if (!charter.picture) {
		charter.picture = null;
	}

	let actualPicture = charter.picture || getAvatarUrl(name);

	// That should be the last of the checks, now insert into the database
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

	const randomName = randomString({ length: 8 });
	const filePublicId = `/organizations/${url}/${randomName}`;

	// Upload the image at the end to reduce the risk of any fatal errors
	const uploadStream = cloudinary.uploader.upload_stream(
		{ public_id: filePublicId },
		function (err, image) {
			if (err) {
				throw err;
			}

			pendingCharter.picture = image.secure_url;
			pendingCharter.save();
		}
	);

	picFile.pipe(uploadStream);
};
