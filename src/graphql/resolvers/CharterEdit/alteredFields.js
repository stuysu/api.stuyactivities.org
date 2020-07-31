import { EDITABLE_CHARTER_FIELDS } from '../../../constants';

export default charterEdit => {
	return EDITABLE_CHARTER_FIELDS.filter(
		field =>
			typeof charterEdit[field] !== 'undefined' &&
			charterEdit[field] !== null
	);
};
