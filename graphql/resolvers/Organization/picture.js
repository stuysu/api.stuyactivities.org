const { URL } = require('url');

const backgroundColors = ['0984e3', '6c5ce7', 'e17055', '00b894', 'ff6b6b'];

module.exports = org => {
	if (org.picture) {
		return org.picture;
	}

	const name = org.name;
	let letters = '';

	for (let x = 0; x < name.length; x++) {
		if (letters.length > 2) {
			break;
		}

		const currentLetter = name[x];
		const isAfterSpace = x > 0 && name[x - 1] === ' ';
		const isUpperCase = currentLetter === currentLetter.toUpperCase();
		const isNumber = !Number.isNaN(parseInt(name[x]));

		if (isAfterSpace || isUpperCase || isNumber) {
			letters += currentLetter.toUpperCase();
		}
	}

	let usciSum = 0;
	for (let i = 0; i < letters.length; i++) {
		usciSum = letters.charCodeAt(i);
	}

	const bgColor = backgroundColors[usciSum % backgroundColors.length];

	const picUrl = new URL('https://ui-avatars.com/api/');
	picUrl.searchParams.append('format', 'svg');
	picUrl.searchParams.append('size', '512');
	picUrl.searchParams.append('length', '3');
	picUrl.searchParams.append('color', 'fff');
	picUrl.searchParams.append('name', letters);
	picUrl.searchParams.append('background', bgColor);

	return picUrl.href;
};
