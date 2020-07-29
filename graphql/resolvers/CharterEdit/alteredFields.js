const { EDITABLE_CHARTER_FIELDS } = require('./../../../constants');

module.exports = charterEdit => {
	return EDITABLE_CHARTER_FIELDS.filter(field => charterEdit[field] !== null);
};
