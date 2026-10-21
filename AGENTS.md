# Agent Instructions

danielfrg.com is Daniel's personal website: an Astro static site deployed to
Cloudflare.

The `README.md` owns setup and usage.
It is written for humans: avoid big restructures, but update it when changes
are user facing.

## Architecture

- Astro 5 with MDX, RSS, and sitemap; linting and formatting with oxlint/oxfmt.
- Content collections live in /src/content (`blog`, `videos`, `config.ts`).
- Cloudflare serves the built `dist/` as static assets (`wrangler.toml`).
- /nbconvert is a rye-managed Python helper that converts blog notebooks to
  HTML with mkdocs-jupyter.

## Content Invariants

- Blog notebooks: `.ipynb` sources live in `src/content/_blog_notebooks/<year>/<month>/`;
  `just notebooks` converts them to HTML in `src/content/_gen_blog_notebooks/`.
- Generated `_gen_blog_notebooks` files are committed. Never hand-edit them;
  change the notebook and re-run the converter instead.
- Each notebook post is a Markdown file under `src/content/blog/<year>/<month>/`
  that references the generated HTML via the `notebook_html_path` frontmatter key.

## Checks and Deployment

- Run `pnpm fmt:check`, `pnpm lint`, and `pnpm check` before sending changes;
  build with `pnpm build`.
- GitHub Actions deploy the site (`deploy.yml`, `deploy-cloudflare.yml`) and
  purge the Cloudflare cache (`purge-cloudflare-cache.yml`); `test.yml` runs CI.
