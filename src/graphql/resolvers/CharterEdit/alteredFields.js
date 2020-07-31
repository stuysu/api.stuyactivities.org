const { EDITABLE_CHARTER_FIELDS } = require('../../../constants');

export default charterEdit => {
	return EDITABLE_CHARTER_FIELDS.filter(
		field =>
			typeof charterEdit[field] !== 'undefined' &&
			charterEdit[field] !== null
	);
};
