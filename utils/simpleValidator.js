const { UserInputError } = require('apollo-server-express');

/**
 * @param input {string} The input from the user to validate
 * @param fields {Array} An array of the fields that are involved if validation fails
 *
 * @param {Object} requirements Things to check for in the input
 *
 * @param {string} [requirements.type] The type of the input. String and Number are supported right now
 *
 * @param [requirements.words] Word-count requirements for string inputs
 * @param {string} [requirements.words.separator]  The character(s) that separate words. Default is a single space character
 * @param {number} [requirements.words.min] The minimum number of words that must be present
 * @param {number} [requirements.words.max] The maximum number of words allowed
 *
 * @param [requirements.characters] Requirements relating to the number of characters in a string
 * @param {number} [requirements.characters.min] The minimum number of characters required in a string
 * @param {number} [requirements.characters.max] The maximum number of characters allowed in a string
 *
 * @param [requirements.range] Requirements having to do with a number input's range of values
 * @param {number} [requirements.range.min] Lowest number that's allowed
 * @param {number} [requirements.range.max] Largest number that's allowed
 *
 * @param {string} [requirements.match] A regex to check against the input
 * @param {Array} [requirements.in] An array of values that the input is only allowed to be
 * @param {boolean} [silent=false] If this is enabled, the function will return false instead of throwing errors
 *
 */
const simpleValidator = (input, requirements, fields, silent = false) => {
	const defaultErrorProps = {
		invalidArgs: fields
	};

	if (requirements.type && typeof input !== requirements.type) {
		if (silent) {
			return false;
		}
		throw new UserInputError(
			'Invalid type received for one or more fields.',
			defaultErrorProps
		);
	}

	if (requirements.words) {
		let separator = requirements.words.separator || ' ';

		// Get rid of empty strings
		let words = input.split(separator).filter(Boolean);

		if (requirements.words.min && words.length < requirements.words.min) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`One or more fields must be at least ${requirements.words.min} words.`,
				defaultErrorProps
			);
		}

		if (requirements.words.max && words.length > requirements.words.max) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`One or more fields must be less than ${requirements.words.max} words.`,
				defaultErrorProps
			);
		}
	}

	if (requirements.characters) {
		if (
			requirements.characters.min &&
			input.length < requirements.characters.min
		) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`One or more fields do not meet the requirement of ${requirements.characters.max} characters.`,
				defaultErrorProps
			);
		}

		if (
			requirements.characters.max &&
			input.length > requirements.characters.max
		) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`Limit of ${requirements.characters.max} characters exceeded for one or more fields.`,
				defaultErrorProps
			);
		}
	}

	if (requirements.range) {
		if (requirements.range.min && input < requirements.range.min) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`One or more fields are out of range. Minimum value: ${requirements.range.min}.`,
				defaultErrorProps
			);
		}

		if (requirements.range.max && input < requirements.range.max) {
			if (silent) {
				return false;
			}
			throw new UserInputError(
				`One or more fields are out of range. Maximum value: ${requirements.range.max}`,
				defaultErrorProps
			);
		}
	}

	if (requirements.in && !requirements.in.includes(input)) {
		if (silent) {
			return false;
		}
		throw new UserInputError(
			`One or more fields has an invalid value.`,
			defaultErrorProps
		);
	}

	if (requirements.match && !new RegExp(requirements.match).test(input)) {
		if (silent) {
			return false;
		}

		throw new UserInputError(
			`One or more fields does not meet the set criteria.`,
			defaultErrorProps
		);
	}

	if (silent) {
		return true;
	}
};

module.exports = simpleValidator;
