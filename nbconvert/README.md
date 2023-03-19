# Jupyter Notebook convert helper

Converts the notebooks using `nbconvert` to `html` and puts the content into a Markdown file.

Reads notebooks from `src/pages` and outputs it to:

- MD to `src/pages/`
- HTML to `public/generated-nbs`

It uses [`mkdocs-jupyter`](https://github.com/danielfrg/mkdocs-jupyter).
