const cloudinary = require('cloudinary').v2;
export default (picture, args) => {
	return cloudinary
		.url(picture.id, {
			...args,
			secure: true
		})
		.replace(
			'https://res.cloudinary.com/stuyactivities/',
			'https://image-cdn.stuyactivities.org/'
		);
};
