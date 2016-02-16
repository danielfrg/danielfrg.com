Title: Blogging with IPython notebooks in pelican
Slug: blogging-pelican-ipython-notebook
Date: 2013-2-16
Tags: Python,Pelican
Author: Daniel Rodriguez

<p class='update'><strong>Update: </strong> Check out the updated post on <a href="{filename}../03/pelican-ipython-notebook-plugin.md">blogging with iPython notebook and pelican with a plugin</a>.</p>

It seems that I spend most time redesigning/developing this blog than actually
blogging xD, just a few weeks ago I wrote about how I was [blogging using jekyll
with iPython notebooks]({filename}../01/new-blog-using-jekyll-and-ipython.md)
and now I am talking about doing the same different static blog engine.

The fact is that a few days ago I found [pelican][pelican], the first serious
python alternative to Jekyll I have found, and after reading 15 minutes about it I was
downloading pelican and creating a theme based on my old Jekyll site.

The switch was easy just needed move some files, change some of the tags from liquid to
[jinja2](http://jinja.pocoo.org/docs/) and add some metadata. The fact of having
less than 10 posts also helped because I did that part manually.

The fact that [pelican][pelican] is on python gave me the idea of creating an
automated way of blogging with ipython notebooks, so I dive a little bit into
the [pelican documentation][pelican-docs] (which is great) and decide to make it.

## How I did it

[Pelican][pelican] uses what thet call
[readers](http://docs.getpelican.com/en/3.1.1/internals.html#how-to-implement-a-new-reader)
to read different formats
(markdown, rst, and now ipynb) and output general HTML so it is very easy to
implement a markup for any language. Also the iPython team has already a
very good [set of converts](https://github.com/ipython/nbconvert) so all I did
was to copy and integrate that necessary code.

Finally I took some of the code from Jake Vanderplas when he talks about
[blogging with Octopress and iPython](http://jakevdp.github.com/blog/2012/10/04/blogging-with-ipython/).
The idea is to encapsulate the ipython notebook HTML and CSS so the CSS of
the site don't get messed up.

## How to use it

I made a [pull request](https://github.com/getpelican/pelican/pull/730)
on the official pelican repo but that may take some time so if if you are impatient can use
[my forked version (brach: ipythonnb-reader)](https://github.com/danielfrg/pelican/tree/ipythonnb-reader)
or even just made the changes yourself as are just a few.

Before anything install pelican and ipython with `pip install pelican ipython` also markdown if you want

First, locate the pelican folder: mine is: `~/.virtualenvs/blog/lib/python2.7/site-packages/pelican/`

At beginning of `readers.py` add this

```python
try:
    import json
    import IPython
    from datetime import datetime
    from util.nbconverter.html import ConverterHTML
except:
    IPython = False
```

On `readers.py` just before `_EXTENSIONS = {}` paste the main reader code

```python
class IPythonReader(Reader):
    enabled = bool(IPython)
    file_extensions = ['ipynb']

    def read(self, filename):
        text = open(filename)
        converter = ConverterHTML(filename)
        converter.read()

        metadata_uni = json.load(text)['metadata']
        metadata2 = {}
        # Change unicode encoding to utf-8
        for key, value in metadata_uni.iteritems():
          if isinstance(key, unicode):
            key = key.encode('utf-8')
          if isinstance(value, unicode):
            value = value.encode('utf-8')
          metadata2[key] = value

        metadata = {}
        for key, value in metadata2.iteritems():
            key = key.lower()
            metadata[key] = self.process_metadata(key, value)
        metadata['ipython'] = True

        content = converter.main_body() # Use the ipynb converter
        # change ipython css classes so it does not mess up the blog css
        content = '\n'.join(converter.main_body())
        # replace the highlight tags
        content = content.replace('class="highlight"', 'class="highlight-ipynb"')
        # specify <pre> tags
        content = content.replace('<pre', '<pre class="ipynb"')
        # create a special div for notebook
        content = '<div class="ipynb">' + content + "</div>"
        # Modify max-width for tables
        content = content.replace('max-width:1500px;', 'max-width:650px;')
        # h1,h2,...
        for h in '123456':
          content = content.replace('<h%s' % h, '<h%s class="ipynb"' % h)
        return content, metadata
```

Second, Create a new folder called `util` on the pelican directory and then download
the [contents of my branch](https://github.com/danielfrg/pelican/tree/ipythonnb-reader/pelican/util)
to that folder.

Now you are ready to blog with the iPython notebooks.

## How to blog

First, need to update the MARKUP setting on `pelicanconf.py` to:
`MARKUP = ('md', 'ipynb')` that way pelican recognizes the `ipynb` format as an article.

Create you super amazing iPython notebook with charts, markdown, etc and save it to the
`content` folder of your pelican site.

Open the `.ipynb` file on your favorite text editor and should see something like this:

```json
{
 "metadata": {
  "name": "Super iPython NB"
 },
 { A_LOT_OF_OTHER_STUFF }
```

Modify the file to:

```json
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

Note that only the title and date tags are actually necessary.

Thats it, couldn't be more simple!

One final thing to do only once is to include the the
[ipython.min.css](https://github.com/danielfrg/pelican/tree/ipythonnb-reader/pelican/themes/ipythonnb/css)
in your pelican theme. Since not all posts are going to be in iPython is not
necessary to include the css file on all pages; so to be more efficient
I created a metadata to identify which posts are from ipython notebooks
so you in your pelican `article.html` template should do:

```html
{% if article.ipython %}
<link rel="stylesheet" href="/theme/css/ipython.min.css">
{% endif %}
```

This particular post uses markdown but most of my previous posts are now converted
from ipython notebooks for example: [copper-quick-data-transformation]({filename}../02/copper-quick-data-transformation-python.ipynb)

If are curious about my pelican config or theme check it out on [github](https://github.com/danielfrg/danielfrg.github.com).

Happy blogging!

<p class='update'><strong>Update: </strong> Check out the updated post on <a href="{filename}../03/pelican-ipython-notebook-plugin.md">blogging with iPython notebook and pelican with a plugin</a>.</p>

[pelican]:http://www.getpelican.com
[pelican-docs]:http://docs.getpelican.com/
