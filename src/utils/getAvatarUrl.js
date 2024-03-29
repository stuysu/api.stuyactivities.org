import { URL } from 'url';

const backgroundColors = ['0984e3', '6c5ce7', 'f19066', '00b894', 'ff6b6b'];
const buggyChars = [
	'&',
	'<',
	'>',
	',',
	'/',
	'?',
	':',
	'@',
	'&',
	'=',
	'+',
	'$',
	'*',
	'#'
];

export default name => {
	name = name.trim();
	let letters = '';

	for (let x = 0; x < name.length; x++) {
		if (letters.length > 2) {
			break;
		}

		const currentLetter = name[x];
		const isFirstLetter = x === 0;
		const isAfterSpace = x > 0 && name[x - 1] === ' ';

		// If it's a URL/XML character incompatible with UI Avatars API
		if (buggyChars.indexOf(currentLetter) !== -1) {
			continue;
		}

		// If it's an uppercase letter or a number/symbol
		const isSignificant =
			currentLetter !== ' ' &&
			currentLetter === currentLetter.toUpperCase();

		if (isFirstLetter || isAfterSpace || isSignificant) {
			letters += currentLetter.toUpperCase();
		}
	}

	let usciSum = 0;
	for (let i = 0; i < letters.length; i++) {
		usciSum += letters.charCodeAt(i);
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
