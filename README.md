# danielfrg.com

[![build](https://github.com/danielfrg/danielfrg.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/danielfrg/danielfrg.com/actions/workflows/deploy.yml)

Source for [danielfrg.com](https://danielfrg.com).

## JS

Uses Node.js >=26.0.0 <27 (see `.node-version`) and pnpm 10.28.0 (see `packageManager` in
`package.json`). Install those versions before running:

```shell
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm fmt:check`, `pnpm lint`, and `pnpm check` for the CI checks,
or `pnpm fmt` to format files. Build the site with `pnpm build`.

## Notebooks

Blog notebooks live in `src/content/_blog_notebooks/<year>/<month>/` and are
converted to HTML with
[mkdocs-jupyter](https://github.com/danielfrg/mkdocs-jupyter) into
`src/content/_gen_blog_notebooks/`. The generated HTML files are committed.

Set up the Python environment (rye-managed) and convert:

```zsh
cd nbconvert
rye sync
```

```zsh
just notebooks
```

Each notebook post is a Markdown file under `src/content/blog/<year>/<month>/`
that points at the generated HTML with the `notebook_html_path` frontmatter
key. See an existing notebook post for the format.
