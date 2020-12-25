const cloudinary = require('cloudinary').v2;
export default (resource, { width, height }) =>
	cloudinary.url(resource.id, {
		width,
		height,
		gravity: 'center',
		crop: 'thumb',
		radius: 'max',
		secure: true
	});
