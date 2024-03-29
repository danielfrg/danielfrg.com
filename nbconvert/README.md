# Jupyter Notebook convert helper

Converts the notebooks using `nbconvert` to `html`.

Reads notebooks from `src/content/blog_notebooks` and outputs it to:
`src/content/_gen_blog_notebooks/`

After that just create a new MD file that points to the generated HTML file
using the key `notebook_html_path`.
See another notebook MD file.

It uses [`mkdocs-jupyter`](https://github.com/danielfrg/mkdocs-jupyter).
