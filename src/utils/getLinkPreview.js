import normalizeUrl from 'normalize-url';
import ogs from 'open-graph-scraper';
import { resolve as resolveUrl } from 'url';

const getLinkPreview = url => {
	const normalizedUrl = normalizeUrl(url);

	return new Promise(resolve => {
		ogs(
			{
				url: normalizedUrl,
				// for some reason a timeout of 1000 equates to a timeout of 6 seconds
				timeout: 1000,
				headers: { 'user-agent': 'googlebot' }
			},
			(error, results) => {
				const title = results.ogTitle || null;
				const description = results.ogDescription || null;
				const url = results.requestUrl || null;
				const ogImage = results.ogImage ? results.ogImage.url : null;

				const image = ogImage
					? resolveUrl(normalizedUrl, ogImage || '')
					: undefined;
				const siteName = results.ogSiteName || null;

				resolve({
					title,
					description,
					url,
					image,
					siteName
				});
			}
		);
	});
};

export default getLinkPreview;
