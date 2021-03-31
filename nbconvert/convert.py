import os
import yaml
from mkdocs_jupyter import nbconvert2

THIS_DIR = os.path.dirname(os.path.realpath(__file__))

GENERATED_MD = """---
{metadata}
---

{html}

<style>
{styles}
</style>
"""


def main(filter=""):
    import glob

    # Iterate the notebooks directory and convert all notebooks
    input_dir = os.path.join(THIS_DIR, "../content/blog/notebooks")
    output_dir = os.path.join(THIS_DIR, "../content/blog/generated-nbs")
    glob_expr = os.path.join(input_dir, f"**/*{filter}*.ipynb")

    for notebook in glob.glob(glob_expr, recursive=True):
        print("Converting:", notebook)
        content = convert(notebook)
        if not content:
            continue

        basename = os.path.basename(notebook)
        output_fname = basename[:-6] + ".md"
        output_path = os.path.join(output_dir, output_fname)
        with open(output_path, "w") as file:
            file.write(content)


def convert(nb_path):
    """Convert a notebook to html with css included and fixes"""

    metadata = get_metadata(nb_path)
    if not metadata:
        return
    metadata_str = yaml.dump(metadata, default_flow_style=False)

    html = nbconvert2.nb2html(nb_path)

    # Since we make a Markdown file we need to remove empty lines and strip
    html = "\n".join([line.rstrip() for line in html.split("\n") if line.rstrip()])

    styles = open(os.path.join(THIS_DIR, "jupyter-fixes.css"), "r").read()

    return GENERATED_MD.format(metadata=metadata_str, html=html, styles=styles)


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
