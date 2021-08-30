'use strict';
import sanitizeHtml from '../../utils/sanitizeHtml';

const models = require('./../models');
const cloudinary = require('cloudinary').v2;
const { encode } = require('html-entities');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */

		const md = require('markdown-it')({
			linkify: true
		});

		const updates = await queryInterface.sequelize.query(
			'SELECT * FROM updates',
			{
				type: queryInterface.sequelize.QueryTypes.SELECT
			}
		);

		// Since we can't use eager loading in raw queries, let's make a map
		const allUpdatePics = await queryInterface.sequelize.query(
			'SELECT * FROM updatePics',
			{
				type: queryInterface.sequelize.QueryTypes.SELECT
			}
		);

		const updateIdPicMap = {};

		allUpdatePics.forEach(pic => {
			let pics = updateIdPicMap[pic.updateId];

			if (!pics) {
				pics = [];
				updateIdPicMap[pic.updateId] = pics;
			}

			pics.push(pic);
		});

		// Update all of the existing updates from markdown to html
		await Promise.all(
			updates.map(async update => {
				if (!update.content) {
					return;
				}

				let content = md.render(update.content.replace(/\n/g, '\n\n'));

				const pics = updateIdPicMap[update.id];
				if (pics && pics.length) {
					content += '<br/>';

					for (let i = 0; i < pics.length; i++) {
						const pic = pics[i];

						const source = cloudinary.url(pic.publicId, {
							secure: 'true'
						});
						const alt = pic.description
							? encode(pic.description)
							: '';
						content += `<p style='text-align: center'><img src="${source}" alt="${alt}" class="platform-image" /></p>`;
					}
				}

				// normalize it
				content = sanitizeHtml(content);

				await queryInterface.sequelize.query(
					'UPDATE updates SET content=$1 WHERE id=$2',
					{
						type: queryInterface.sequelize.QueryTypes.UPDATE,
						bind: [content, update.id]
					}
				);
			})
		);

		// Update the meeting descriptions
		const meetings = await models.meetings.findAll({
			attributes: ["description"]
		});

		await Promise.all(
			meetings.map(meeting => {
				if (!meeting.description) {
					return;
				}

				meeting.description = sanitizeHtml(
					md.render(meeting.description.replace(/\n/g, '\n\n'))
				);

				return meeting.save();
			})
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		const TurndownService = require('turndown');

		const turndownService = new TurndownService();

		const meetings = await models.meetings.findAll();

		await Promise.all(
			meetings.map(meeting => {
				if (!meeting.description) {
					return;
				}

				meeting.description = turndownService.turndown(
					meeting.description
				);
				return meeting.save();
			})
		);

		const updates = await models.updates.findAll();
		await Promise.all(
			updates.map(update => {
				if (!update.content) {
					return;
				}

				update.content = turndownService.turndown(update.content);

				return update.save();
			})
		);
	}
};
