'use strict';
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

		const updates = await models.updates.findAll({
			include: models.updatePics
		});

		// Update all of the existing updates from markdown to html
		await Promise.all(
			updates.map(update => {
				if (!update.content) {
					return;
				}

				update.content = md.render(update.content);

				const pics = update.updatePics;
				if (pics.length) {
					update.content += '<br/>';

					for (let i = 0; i < pics.length; i++) {
						const pic = pics[i];

						const source = cloudinary.url(pic.publicId, {
							secure: 'true'
						});
						const alt = pic.description
							? encode(pic.description)
							: '';
						update.content += `<p style='text-align: center'><img src="${source}" alt="${alt}" class="platform-image" /></p>`;
					}
				}

				return update.save();
			})
		);

		// Update the meeting descriptions
		const meetings = await models.meetings.findAll();

		await Promise.all(
			meetings.map(meeting => {
				if (!meeting.description) {
					return;
				}

				meeting.description = md.render(meeting.description);

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
