# -*- coding: utf-8 -*- #

SITEURL = ''
# SITEURL = 'http://danielfrg.github.io'
AUTHOR = 'Daniel Rodriguez'
SITENAME = 'Daniel Rodriguez'
TIMEZONE = 'UTC'
DEFAULT_LANG = 'en'
MARKUP = ('md', 'ipynb')
DEFAULT_DATE_FORMAT = '%B %d, %Y'

PAGE_DIR = 'pages'
ARTICLE_DIR = 'articles'

SUMMARY_MAX_LENGTH = 150
DEFAULT_PAGINATION = 10

THEME = 'themes/middle/'
STATIC_PATHS = ['images']

SITEMAP = {
    'format': 'xml'
}

PLUGIN_PATH = 'plugins'
PLUGINS = ['sitemap', 'ipythonnb']

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'

# Paths are relative to `content`
STATIC_PATHS = ['images', 'favicon.ico', '404.html', 'robots.txt', 'CNAME']

# Theme settings
DEFAUT_HEADER_BG = '/images/forest.jpg'
ABOUT_PAGE = '/pages/about.html'
TWITTER_USERNAME = 'danielfrg'
GITHUB_USERNAME = 'danielfrg'
SHOW_ARCHIVES = True
SHOW_FEED = True

GOOGLE_ANALYTICS = 'UA-35523657-2'
DISQUS_USERNAME = 'danielfrg'
