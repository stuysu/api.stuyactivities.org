import createMeeting from './createMeeting';
import moment from 'moment';
import { UserInputError } from 'apollo-server-express';

export default async (root, args, ctx) => {
	ctx.adminRoleRequired('admin');
	if (args.weeks < 1)
		throw new UserInputError('Must repeat for a positive number of weeks!');
	return Array.from(Array(args.weeks).keys()).map(i => {
		console.log(
			args.start,
			moment(args.start).add(7, 'days'),
			args.end,
			moment(args.end).add(7, 'days'),
			i
		);
		return createMeeting(
			root,
			{
				...args,
				start: moment(args.start).add(7 * i, 'days'),
				end: moment(args.end).add(7 * i, 'days')
			},
			ctx
		);
	});
};
