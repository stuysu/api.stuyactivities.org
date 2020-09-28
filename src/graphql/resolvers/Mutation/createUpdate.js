import { UserInputError } from 'apollo-server-errors';
import getLinkPreview from '../../../utils/getLinkPreview';
import cryptoRandomString from 'crypto-random-string';
import uploadPicStream from '../../../utils/uploadPicStream';
import honeybadger from '../../../middleware/honeybadger';

const allowedTypes = ['private', 'public'];
export default async (
	root,
	{
		orgId,
		title,
		content,
		type,
		notifyMembers,
		notifyFaculty,
		localPinned,
		links,
		pictures
	},
	{ session, models }
) => {
	session.authenticationRequired();
	await session.orgAdminRequired(orgId);

	if (!allowedTypes.includes(type)) {
		throw new UserInputError('That is not a valid update type', {
			invalidArgs: ['type']
		});
	}

	if (!title) {
		throw new UserInputError('The title field cannot be left empty', {
			invalidArgs: 'title'
		});
	}

	if (!content) {
		throw new UserInputError('The content field cannot be left empty', {
			invalidArgs: 'title'
		});
	}

	if (pictures) {
		if (pictures.length > 10) {
			throw new UserInputError(
				'You cannot upload more than 10 pictures',
				{
					invalidArgs: ['pictures']
				}
			);
		}

		for (let i = 0; i < pictures.length; i++) {
			const pic = await pictures[i].file;
			pictures[i].file = pic;
			if (!pic.mimetype || !pic.mimetype.startsWith('image/')) {
				throw new UserInputError(
					'One or more uploaded pictures is not a valid image',
					{
						invalidArgs: ['pictures']
					}
				);
			}
		}
	}

	if (links && links.length > 2) {
		throw new UserInputError(
			'You cannot attach more than 2 links to an update',
			{
				invalidArgs: ['links']
			}
		);
	}

	const update = await models.updates.create({
		organizationId: orgId,
		submittingUserId: session.userId,
		title,
		content,
		type,
		// Private posts are approved instantly
		approval: type === 'private' ? 'approved' : 'pending',
		localPinned,
		globalPinned: false
	});

	if (links) {
		const linkPromises = links.map(async url => {
			const preview = await getLinkPreview(url);

			// Don't add any links that don't have a valid title
			if (preview.title) {
				return models.updateLinks.create({
					updateId: update.id,
					url: preview.url,
					title: preview.title,
					description: preview.description,
					siteName: preview.siteName,
					image: preview.image
				});
			}
		});
	}

	if (pictures) {
		const organization = await models.organizations.idLoader.load(orgId);

		pictures.map(async pic => {
			const randomName = cryptoRandomString({ length: 8 });
			const filePublicId = `organizations/${organization.url}/${randomName}`;

			const file = pic.file;

			const image = await uploadPicStream(file, filePublicId);

			await models.updatePics.create({
				updateId: update.id,
				publicId: filePublicId,
				description: pic.description,
				width: image.width,
				height: image.height,
				mimetype: file.mimetype
			});
		});
	}

	return update;
};