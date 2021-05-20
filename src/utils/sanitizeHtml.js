// Reused from https://github.com/abir-taheer/vote.stuysu.org/blob/main/utils/candidate/sanitizeHtml.js

import sanitize from 'sanitize-html';

export default function sanitizeHtml(platform) {
	return sanitize(platform, {
		// Only allow that tags that are used by TinyMCE that we allow
		allowedTags: [
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'li',
			'ol',
			'p',
			'pre',
			'ul',
			'a',
			'br',
			'code',
			'em',
			'i',
			'span',
			'strong',
			'time',
			'img',
			'iframe'
		],
		// If some html doesn't follow a rule, get rid of it completely
		disallowedTagsMode: 'discard',
		allowedAttributes: {
			a: ['href', 'name', 'target', 'rel', 'style', 'title'],
			img: ['src', 'alt', 'height', 'width', 'style', 'class'],
			span: ['style'],
			iframe: [
				'allowfullscreen',
				'src',
				'height',
				'width',
				'style',
				'class'
			],
			h1: ['style'],
			h2: ['style'],
			h3: ['style'],
			h4: ['style'],
			h5: ['style'],
			h6: ['style'],
			pre: ['style'],
			p: ['style']
		},
		allowedStyles: {
			// Text alignment can be applied to any element
			'*': {
				'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/]
			},

			// Spans can only style the color or background color
			span: {
				color: [
					/^#(0x)?[0-9a-f]+$/i,
					/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
				],
				'background-color': [
					/^#(0x)?[0-9a-f]+$/i,
					/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
				]
			},

			// Paragraph tags can be indented from 0px to 80px
			p: {
				'padding-left': [/^[0-8]?[0]px$/]
			},

			// Image tags can use any float style
			img: {
				float: [/^right$/, /^left$/, /^none$/, /^initial$/, /^inherit$/]
			}
		},
		selfClosing: [
			'img',
			'br',
			'hr',
			'area',
			'base',
			'basefont',
			'input',
			'link',
			'meta'
		],
		// URL schemes we permit
		allowedSchemesByTag: {
			// Don't allow images from non-https sources
			img: ['https'],

			// Allow website, email, and phone links
			a: ['http', 'https', 'mailto', 'tel']
		},
		allowProtocolRelative: true,
		enforceHtmlBoundary: false,

		transformTags: {
			// Add a rel=noopener to links to prevent cross origin vulnerability
			a: sanitize.simpleTransform('a', {
				rel: 'noopener',
				target: '_blank'
			}),

			// Add a custom class to images and iframes that keeps them from overflowing the page
			img: sanitize.simpleTransform('img', {
				class: 'platform-image'
			}),
			iframe: sanitize.simpleTransform('iframe', {
				class: 'platform-iframe'
			})
		},

		// Only allow embeds from youtube and vimeo
		allowedIframeHostnames: [
			'www.youtube.com',
			'youtube.com',
			'vimeo.com',
			'player.vimeo.com',
			'youtu.be'
		],
		nestingLimit: 5
	});
}
