# -*- coding: utf-8 -*- #

SITEURL = '/'
# SITEURL = 'http://danielfrg.github.io'
AUTHOR = 'Daniel Rodriguez'
SITENAME = 'Daniel Rodriguez'
TIMEZONE = 'UTC'
DEFAULT_LANG = 'en'
MARKUP = ('md', 'ipynb')
DEFAULT_DATE_FORMAT = '%d.%m.%Y'

PATH = './'
PAGE_DIR = './pages'
ARTICLE_DIR = './blog'

THEME = "./themes/middle/"
STATIC_PATHS = ["images"]

SITEMAP = {
    'format': 'xml'
}

PLUGIN_PATH = './plugins'
PLUGINS = ['sitemap', 'ipythonnb']

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'

FILES_TO_COPY = (('robots.txt', 'robots.txt'),
                 ('404.html', '404.html'),
                 ('favicon.ico', 'favicon.ico'),
                 ('google_verification.html', 'googleaa9959ae757fe3e1.html'),)

# Theme settings
HOMEPAGE_INTRO = "This blog is written by Daniel Rodriguez. He writes about coding, python, data science and his projects"

TWITTER_USERNAME = "danielfrg"
GITHUB_USERNAME = "danielfrg"
EMAIL_ADDRESS = "df.rodriguez143@gmail.com"
SHOW_FEED = True

GOOGLE_ANALYTICS = 'UA-35523657-2'
DISQUS_USERNAME = 'danielfrg'
