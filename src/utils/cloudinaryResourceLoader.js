import cloudinary from 'cloudinary';
import DataLoader from 'dataloader';

async function batchLoader(publicIds) {
	// Remove any duplicates
	const ids = Array.from(new Set(publicIds));

	const { resources } = await cloudinary.v2.api.resources_by_ids(ids, {
		max_results: ids.length
	});

	const publicIdMap = {};

	resources.forEach(resource => {
		publicIdMap[resource.public_id] = resource;
	});

	return publicIds.map(id => publicIdMap[id] || null);
}

const cloudinaryResourceLoader = new DataLoader(batchLoader, { cache: false });

export default cloudinaryResourceLoader;
