# danielfrg.com

[![build](https://github.com/danielfrg/danielfrg.com/workflows/deploy/badge.svg)](https://github.com/danielfrg/danielfrg.com/actions/workflows/deploy.yml)

Source for [danielfrg.com](danielfrg.com).

## JS

```shell
pnpm install
pnpm dev
```

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
