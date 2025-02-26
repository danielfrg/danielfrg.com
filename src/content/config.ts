import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    description: z.string().optional().default(""),
    draft: z.boolean().optional(),
    notebook_html_path: z.string().optional(),
  }),
});

const videos = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    link: z.string(),
    lang: z.string().optional(),
  }),
});

export const collections = { blog, videos };
