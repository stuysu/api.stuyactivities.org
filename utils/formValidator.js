/*
	example requirements:
	for a string
	{
		type: "string",
		words: {
			min: 150,
			max: 300,
			separator: " "
		},
		characters: {
			min: 200,
			max: 1000
		}
	}

	for a number:
	{
		type: "number",
		range: {
			min: 0,
			max: 100
		},
		isInt: false
	}

	for an array:
	it'll check for each item
	{
		type: "array",
		itemType: "string",
		allowedValues: ["Monday", "Tuesday", "Wednesday"]
	}
 */

const formValidator = (input, requirements) => {};
