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

THEME = "themes/middle/"
STATIC_PATHS = ["images"]

SITEMAP = {
    'format': 'xml'
}

PLUGIN_PATH = 'plugins'
PLUGINS = ['sitemap', 'ipythonnb']

ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'

# Paths are relative to `content`
STATIC_PATHS = ['images', 'favicon.ico', '404.html', 'robots.html']

# Theme settings
HOMEPAGE_INTRO = "Here is where Daniel Rodriguez writes about coding, python, data science and his projects"
HOMEPAGE_DATE_FORMAT = '%d.%m.%Y'

TWITTER_USERNAME = "danielfrg"
GITHUB_USERNAME = "danielfrg"
LINKEDIN_PROFILE = "http://www.linkedin.com/profile/view?id=40926067"
SHOW_FEED = True
EMAIL_ADDRESS = "df.rodriguez143@gmail.com"

METADATA_DATE_FORMAT = '%B %d, %Y'
GOOGLE_ANALYTICS = 'UA-35523657-2'
DISQUS_USERNAME = 'danielfrg'
