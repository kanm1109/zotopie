import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articleSchema = ({ image }: any) =>
	z
		.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().default('Zotopie Team'),
			tags: z.array(z.string()).default([]),
			category: z.string().default('blog'),
			featuredImage: z.optional(image()),
			heroImage: z.optional(image()),
			draft: z.boolean().default(false),
		})
		.transform((data) => ({
			...data,
			publishDate: data.publishDate ?? data.pubDate ?? new Date(),
			featuredImage: data.featuredImage ?? data.heroImage,
		}));

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

const reddit = defineCollection({
	loader: glob({ base: './src/content/reddit', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

const threads = defineCollection({
	loader: glob({ base: './src/content/threads', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

const extensions = defineCollection({
	loader: glob({ base: './src/content/extensions', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

const marketing = defineCollection({
	loader: glob({ base: './src/content/marketing', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

export const collections = { blog, reddit, threads, extensions, marketing };
