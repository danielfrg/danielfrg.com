from __future__ import unicode_literals

SITEURL = ''
AUTHOR = u'Daniel Rodriguez'
SITENAME = u'Daniel Rodriguez'
TIMEZONE = 'UTC'
DEFAULT_DATE_FORMAT = '%B %d, %Y'

DEFAULT_LANG = 'en'
IGNORE_FILES = ['.ipynb_checkpoints']
MARKUP = ('md', 'ipynb')
SUMMARY_MAX_LENGTH = 150
DEFAULT_PAGINATION = 10
THEME = 'theme'

OUTPUT_PATH = 'output/'
ARTICLE_PATHS = ['content']
USE_FOLDER_AS_CATEGORY = False
DEFAULT_CATEGORY = 'misc'
PAGE_PATHS = ['content/pages']
CACHE_PATH = 'cache/'
CACHE_CONTENT = True
LOAD_CONTENT_CACHE = False
DELETE_OUTPUT_DIRECTORY = True

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
PAGE_URL = '{category}/{slug}/'
PAGE_SAVE_AS = '{category}/{slug}/index.html'
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/%s.atom.xml'

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'codehilite'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}

# Paths are relative to `content`
STATIC_PATHS = ['images', 'favicon.ico', '404.html', 'robots.txt', 'CNAME']

# PLUGINS SETTINGS
PLUGIN_PATHS = ['plugins']
PLUGINS = ['sitemap', 'ipynb.markup', 'ipynb.liquid', 'liquid_tags.youtube', 'liquid_tags.b64img']

SITEMAP = {
    'format': 'xml'
}

IPYNB_EXTEND_STOP_SUMMARY_TAGS = [('h2', None), ('ol', None), ('ul', None)]
IPYNB_NB_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/notebook.ipynb'
IPYNB_USE_META_SUMMARY = True
IPYNB_EXPORT_TEMPLATE = 'notebook.tpl'
