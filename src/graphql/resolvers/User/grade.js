export default (user, args, authenticationRequired) => {
	authenticationRequired();

	if (typeof user.gradYear !== 'number') {
		return null;
	}

	// the grade goes up
	const graduationDate = new Date(`June 28, ${user.gradYear}`);
	const millisecondsInAYear = 1000 * 60 * 60 * 24 * 365;
	const now = new Date();

	const millisecondsTillGraduation = graduationDate.getTime() - now.getTime();
	const seniorGrade = 12;
	let yearsLeft = Math.floor(
		millisecondsTillGraduation / millisecondsInAYear
	);

	// Cap the grade of alumni at 13
	if (yearsLeft < -1) {
		yearsLeft = -1;
	}

	return seniorGrade - yearsLeft;
};
