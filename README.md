# danielfrg.com

[![build](https://github.com/danielfrg/danielfrg.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/danielfrg/danielfrg.com/actions/workflows/deploy.yml)

Source for [danielfrg.com](danielfrg.com).

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

We use `mkdocs-jupyter` to convert the notebooks to markdown.

We save the notebooks into `src/pages/blog/notebooks`
and we also commit the converted ones under `src/pages/blog`

Create Python environment:

```shell
mamba env create
conda activate danielfrg.com
```

Convert notebooks to markdown:

```shell
python nbconvert/convert.py
```
