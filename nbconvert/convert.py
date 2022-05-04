import os

import yaml
from mkdocs_jupyter import nbconvert2

THIS_DIR = os.path.dirname(os.path.realpath(__file__))

GENERATED_MD = """---
layout: ../../../../layouts/NotebookBlogPost.astro
{metadata}
notebook_html_path: ../src/pages/blog/generated-nbs/{fpath}
---

"""

GENERATED_HTML = """
{html}

<style>
{styles}
</style>
"""


def main(filter=""):
    import glob

    # Iterate the notebooks directory and convert all notebooks
    input_dir = os.path.join(THIS_DIR, "../src/pages/blog/notebooks")
    output_dir = os.path.join(THIS_DIR, "../src/pages/blog/")
    output_dir_gen = os.path.join(THIS_DIR, "../src/pages/blog/generated-nbs")
    glob_expr = os.path.join(input_dir, f"**/*{filter}*.ipynb")

    for notebook in glob.glob(glob_expr, recursive=True):
        print("Converting:", notebook)

        basename = os.path.basename(notebook)
        output_fname_md = basename[:-6] + ".md"
        output_fname_html = basename[:-6] + ".html"
        head, name = os.path.split(notebook)
        head, month = os.path.split(head)
        head, year = os.path.split(head)
        output_path_md = os.path.join(output_dir, year, month, output_fname_md)
        output_path_html = os.path.join(output_dir_gen, output_fname_html)

        metadata_html_path = os.path.join(output_dir_gen, output_fname_html)

        md, html = convert(notebook, fpath=output_fname_html)
        if not md:
            continue

        with open(output_path_md, "w") as file:
            print("Writing to:", output_path_md)
            file.write(md)

        with open(output_path_html, "w") as file:
            print("Writing to:", output_path_html)
            file.write(html)


def convert(nb_path, fpath):
    """Convert a notebook to html with css included and fixes"""

    metadata = get_metadata(nb_path)
    if not metadata:
        return
    metadata_str = yaml.dump(metadata, default_flow_style=False)

    html_base = nbconvert2.nb2html(nb_path, theme="light")

    # Since we make a Markdown file based on the HTML we need to:
    # - remove empty lines
    # - strip possible HTML lines that are indented: styles and script tags

    html = ""
    onHead = True
    for i, line in enumerate(html_base.split("\n")):
        stripped = line.strip()
        # html += stripped
        if len(stripped) > 0:
            # if onHead:
            # if '<div class="jupyter-wrapper">' in line:
            #     onHead = False
            if (
                stripped.startswith("<style ")
                or stripped.startswith("<script ")
                or stripped.startswith("<!--")
                or stripped.startswith("<div")
            ):
                html += stripped
            else:
                html += line
            # else:
            #     html += line

            html += "\n"

    styles = open(os.path.join(THIS_DIR, "jupyter-fixes.css"), "r").read()

    return GENERATED_MD.format(
        metadata=metadata_str, fpath=fpath
    ), GENERATED_HTML.format(html=html, styles=styles)


def get_metadata(nb_path):
    """Read the <notebook>.yml file associated with a notebook and return the metadata"""
    filedir = os.path.dirname(nb_path)
    filename = os.path.basename(nb_path)
    metadata_filename = os.path.splitext(filename)[0] + ".yml"
    metadata_filepath = os.path.join(filedir, metadata_filename)

    if not os.path.exists(metadata_filepath):
        print("No .yml file found for {f}".format(f=nb_path))
        return

    with open(os.path.join(filedir, metadata_filename), "r") as f:
        try:
            return yaml.load(f, Loader=yaml.FullLoader)
        except yaml.YAMLError as exc:
            print(exc)


if __name__ == "__main__":
    import fire

    fire.Fire(main)
