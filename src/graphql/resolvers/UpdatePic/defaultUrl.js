const cloudinary = require('cloudinary').v2;

export default pic => {
	return cloudinary.url(pic.publicId, {
		secure: true,
		quality: 'auto',
		flags: 'lossy'
	});
};
