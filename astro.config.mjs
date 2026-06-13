// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://zotopie.com',
	integrations: [
		mdx(),
		sitemap({
			lastmod: new Date(),
			filter: (page) => !page.includes('?') && !page.includes('/go/') && !page.endsWith('/search/') && page !== 'https://zotopie.com/search/',
			serialize(item) {
				const url = item.url;
				if (url === 'https://zotopie.com/') {
					return { ...item, changefreq: 'daily',   priority: 1.0 };
				}
				if (url === 'https://zotopie.com/reviews/') {
					return { ...item, changefreq: 'weekly',  priority: 0.9 };
				}
				if (url.includes('/category/')) {
					return { ...item, changefreq: 'weekly',  priority: 0.9 };
				}
				if (url.includes('/reviews/')) {
					return { ...item, changefreq: 'monthly', priority: 0.8 };
				}
				if (url.includes('/alternatives/')) {
					return { ...item, changefreq: 'monthly', priority: 0.7 };
				}
				if (url.includes('/compare/')) {
					return { ...item, changefreq: 'monthly', priority: 0.7 };
				}
				if (url.includes('/best/')) {
					return { ...item, changefreq: 'weekly',  priority: 0.9 };
				}
				if (url.includes('/search')) {
					return { ...item, changefreq: 'monthly', priority: 0.4 };
				}
				return { ...item, changefreq: 'monthly', priority: 0.5 };
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
