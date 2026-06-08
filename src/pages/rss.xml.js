import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [blogs, reddits, threads, extensions, marketings] = await Promise.all([
		getCollection('blog', ({ data }) => !data.draft),
		getCollection('reddit', ({ data }) => !data.draft),
		getCollection('threads', ({ data }) => !data.draft),
		getCollection('extensions', ({ data }) => !data.draft),
		getCollection('marketing', ({ data }) => !data.draft),
	]);

	const allPosts = [
		...blogs.map((p) => ({ ...p, collection: 'blog' })),
		...reddits.map((p) => ({ ...p, collection: 'reddit' })),
		...threads.map((p) => ({ ...p, collection: 'threads' })),
		...extensions.map((p) => ({ ...p, collection: 'extensions' })),
		...marketings.map((p) => ({ ...p, collection: 'marketing' })),
	].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `/${post.collection}/${post.id}/`,
		})),
	});
}
