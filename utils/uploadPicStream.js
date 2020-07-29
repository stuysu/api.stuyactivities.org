const cloudinary = require('cloudinary').v2;
module.exports = (picture, publicId) =>
	new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ public_id: publicId },
			function (err, image) {
				err ? reject(err) : resolve(image);
			}
		);

		picture.pipe(uploadStream);
	});
