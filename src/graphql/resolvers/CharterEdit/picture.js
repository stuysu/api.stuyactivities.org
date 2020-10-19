export default charter => {
	if (charter.picture) {
		return charter.picture.replace(
			'https://res.cloudinary.com/stuyactivities/',
			'https://image-cdn.stuyactivities.org/'
		);
	}
};
