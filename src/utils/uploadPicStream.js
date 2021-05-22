const cloudinary = require('cloudinary').v2;
const uploadPicStream = (picture, publicId, params = {}) =>
	new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ public_id: publicId, ...params },
			function (err, image) {
				err ? reject(err) : resolve(image);
			}
		);

		picture.createReadStream().pipe(uploadStream);
	});

export default uploadPicStream;
