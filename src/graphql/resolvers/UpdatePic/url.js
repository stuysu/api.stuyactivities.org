const cloudinary = require('cloudinary').v2;
export default (picture, args) => {
	return cloudinary
		.url(picture.publicId, {
			...args,
			secure: true,
			sign_url: Boolean(Object.keys(args).length)
		})
		.replace(
			'https://res.cloudinary.com/stuyactivities/',
			'https://image-cdn.stuyactivities.org/'
		);
};
