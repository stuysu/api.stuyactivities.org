import simpleValidator from './simpleValidator';
import { UserInputError } from 'apollo-server-express';

const charterValidator = (field, value, silent = false) => {
	const simpleValidations = {
		mission: {
			type: 'string',
			characters: { min: 20, max: 150 }
		},
		purpose: {
			type: 'string',
			words: { min: 150, max: 400 }
		},
		benefit: {
			type: 'string',
			words: { min: 200, max: 400 }
		},
		appointmentProcedures: {
			type: 'string',
			words: { min: 150, max: 400 }
		},
		uniqueness: {
			type: 'string',
			words: {
				min: 75,
				max: 400
			}
		},
		extra: {
			type: 'string',
			characters: { max: 1000 }
		},
		meetingSchedule: {
			type: 'string',
			characters: {
				min: 50,
				max: 1000
			}
		},
		returningInfo: {
			type: 'string',
			words: {
				min: 50,
				max: 1000
			}
		},
		commitmentLevel: {
			type: 'string',
			in: ['low', 'medium', 'high']
		}
	};

	if (simpleValidations[field]) {
		simpleValidator(value, simpleValidations[field], [field], silent);
	}

	if (field === 'meetingDays') {
		const allowedDays = [
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday'
		];

		if (!Array.isArray(value) || !value.length) {
			if (silent) {
				return false;
			}

			throw new UserInputError(
				'You need to specify the days that your organization has meetings.',
				{
					invalidArgs: ['meetingDays']
				}
			);
		}

		value = [...new Set(value)];
		value.forEach(input =>
			simpleValidator(
				input,
				{
					type: 'string',
					in: allowedDays
				},
				['meetingDays'],
				silent
			)
		);
	}

	if (field === 'keywords') {
		if (!Array.isArray(value) || !value.length) {
			if (silent) {
				return false;
			}

			throw new UserInputError(
				'You need to specify keywords relating to your organization.',
				{
					invalidArgs: ['meetingDays']
				}
			);
		}

		if (value.length > 3) {
			if (silent) {
				return false;
			}

			throw new UserInputError(
				'You can only specify a max of 3 keywords.',
				{
					invalidArgs: ['keywords']
				}
			);
		}
	}

	if (field === 'picture' && value) {
		if (!value.mimetype || !value.mimetype.startsWith('image/')) {
			if (silent) {
				return false;
			}

			throw new UserInputError(
				'Only image files can be uploaded as the picture.',
				{
					invalidArgs: ['picture']
				}
			);
		}
	}

	if (silent) {
		return true;
	}
};

export default charterValidator;
