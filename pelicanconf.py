from __future__ import unicode_literals

LOAD_CONTENT_CACHE = False

SITEURL = ''
# SITEURL = 'http://danielfrg.github.io'
AUTHOR = u'Daniel Rodriguez'
SITENAME = u'Daniel Rodriguez'

TIMEZONE = 'UTC'

DEFAULT_LANG = 'en'

MARKUP = ('md', 'ipynb')

DEFAULT_DATE_FORMAT = '%B %d, %Y'

SUMMARY_MAX_LENGTH = 150
DEFAULT_PAGINATION = 10

PAGE_DIRS = ['pages']
ARTICLE_DIRS = ['articles']

THEME = 'themes/middle/'
STATIC_PATHS = ['images']

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'

PAGE_SAVE_AS = '{category}/{slug}.html'
PAGE_URL = PAGE_SAVE_AS

# Paths are relative to `content`
STATIC_PATHS = ['images', 'favicon.ico', '404.html', 'robots.txt', 'CNAME']

# THEME SETTINGS
DEFAULT_HEADER_BG = '/images/station1.jpg'
ABOUT_PAGE = '/pages/about.html'
TWITTER_USERNAME = 'danielfrg'
GITHUB_USERNAME = 'danielfrg'
SHOW_ARCHIVES = True
SHOW_FEED = True

GOOGLE_ANALYTICS_CODE = 'UA-35523657-2'
GOOGLE_ANALYTICS_DOMAIN = 'danielfrg.com'
DISQUS_USERNAME = 'danielfrg'

# PLUGINS SETTINGS
PLUGIN_PATHS = ['plugins']
PLUGINS = ['sitemap', 'ipynb']

SITEMAP = {
    'format': 'xml'
}

IPYNB_EXTEND_STOP_SUMMARY_TAGS = [('h2', None), ('ol', None), ('ul', None)]
