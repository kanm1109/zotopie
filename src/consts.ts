export const SITE_TITLE = 'Zotopie';
export const SITE_DESCRIPTION =
	'Software reviews and digital marketing insights. Find the best tools, strategies, and guides for Reddit, Threads, browser extensions, and more.';
export const SITE_URL = 'https://zotopie.com';
export const TWITTER_HANDLE = '@zotopie';
export const POSTS_PER_PAGE = 12;

export const CATEGORIES = [
	{
		name: 'Reddit',
		slug: 'reddit',
		description: 'Reddit marketing strategies, tips, and growth hacks.',
	},
	{
		name: 'Threads',
		slug: 'threads',
		description: 'Threads app guides, strategies, and best practices.',
	},
	{
		name: 'Extensions',
		slug: 'extensions',
		description: 'Browser extension reviews and productivity guides.',
	},
	{
		name: 'Marketing',
		slug: 'marketing',
		description: 'Digital marketing tactics, tools, and insights.',
	},
	{
		name: 'Blog',
		slug: 'blog',
		description: 'Software reviews, tutorials, and digital guides.',
	},
] as const;
