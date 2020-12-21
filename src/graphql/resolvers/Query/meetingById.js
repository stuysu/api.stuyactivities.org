export default (query, { id }, { models }) => models.meetings.idLoader.load(id);
