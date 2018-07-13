Title: Plugin for blogging with IPython notebooks in Pelican
Slug: pelican-ipython-notebook-plugin
Date: 2013-3-8
Tags: Python,Pelican
Author: Daniel Rodriguez

This is just a little update on my previous post about [Blogging with iPython notebooks with pelican]({filename}../02/blogging-pelican-ipython-notebook.md).

One of the people behind pelican helped me to convert the [previous code]({filename}../02/blogging-pelican-ipython-notebook.md) to a pelican plugin and I just made it available via github: [pelican-ipythonnb](https://github.com/danielfrg/pelican-ipythonnb).

The only thing that changed is the installation but the docs on how to use it is below (or in the readme of the repo).

An example is my last post about a [cleaning data for a Kaggle competition]({filename}kaggle-bulldozers-basic-cleaning.ipynb).

Happy blogging!

## Installation

Download plugin files: `plugin/ipythonnb.py` and the `plugin/nbconverter` directory.

The esiest way is to locate the pelican directory (for example: `~/.virtualenvs/blog/lib/python2.7/site-packages/pelican/`) and paste plugins files in the `pelican/plugins` folder.
Then in the `pelicanconf.py` put: `PLUGINS = ['pelican.plugins.ipythonnb']`.

But is also is possible to add plugins on the same directory of the pelican project:
Create a folder called `custom_plugins_dir` (NOTE: the name can be anything but do not use `plugins`) and paste the plugin files there.
Then in the `pelicanconf.py` put: `PLUGINS = ['custom_plugins_dir.ipythonnb']`.

In both cases also need to modify the MARKUP setting: On the `pelicanconf.py` put: `MARKUP = ('md', 'ipynb')`

## Add the CSS to the theme

Download the `ipython.css` file from the `assets` directory and place it in your theme static folder. Then include the CSS on the theme template:

```
{% if article.ipython %}
    <link rel="stylesheet" href="/theme/css/ipython.min.css">
{% endif %}
```

## How to blog

Write the post using the iPython notebook interface, using markdown or anything.

Then open the `.ipynb` file in a text editor and should see.

```
{
    "metadata": {
        "name": "Super iPython NB"
    },
{ A_LOT_OF_OTHER_STUFF }
```

Add the metadata for example:

```
{
 "metadata": {
        "name": "Super iPython NB",
        "Title": "Blogging with iPython notebooks in pelican",
        "Date": "2013-2-16",
        "Category": "Category",
        "Tags": "tag2, tag2",
        "slug": "slug-slug-slug",
        "Author": "Me"
    },
    { A_LOT_OF_OTHER_STUFF }
```

And thats it! Add the `.ipynb` file to the `content` folder in the pelican project and should generate a new post.
