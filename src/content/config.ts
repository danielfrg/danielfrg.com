import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    draft: z.boolean().optional(),
    notebook_html_path: z.string().optional(),
  }),
});

export const collections = { blog };
