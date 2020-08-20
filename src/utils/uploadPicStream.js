import honeybadger from '../middleware/honeybadger';

const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const uploadPicStream = (picture, publicId) =>
	new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ public_id: publicId },
			function (err, image) {
				if (err) {
					honeybadger.notify(err);
					reject(err);
				} else {
					resolve(image);
				}
			}
		);

		picture.createReadStream().pipe(uploadStream);
	});

export default uploadPicStream;
