import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://danielfrg.com",
    integrations: [mdx(), sitemap(), tailwind()],
    markdown: {
        // drafts: true,
        syntaxHighlight: "prism",
    },
});
