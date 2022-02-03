export default (
	_,
	{ },
	{ models: { saleItems } }
) =>
	saleItems.findAll({});
