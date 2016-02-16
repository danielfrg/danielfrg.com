Title: Django + Celery + Readability = Python relevant content crawler
Slug: django-celery-readability-crawler
Date: 2013-9-11
Tags: πython,Django,Celery,Readability,Crawling
Author: Daniel Rodriguez

I have written a [few]({filename}../08/relevant-content-blog-crawler.ipynb) [posts]({filename}../04/nba-scraping-data.md)
about crawling content from the web. Mainly because I know the power of data
and the biggest data source in the world is the web, Google knew it and we all now how they are
doing. In my [last post]({filename}../08/relevant-content-blog-crawler.ipynb) I wrote about crawling relevant content
from blogs; It worked but what if I want an admin UI to control the crawling. What if I just put
the crawler in an EC2 instance and just call it when I need to crawl.

The solution was pretty simple thanks to some python projects.
I just needed to move from [sqlalchemy](http://www.sqlalchemy.org/) to
[django](https://docs.djangoproject.com/en/1.5/) ORM, create a few [celery](http://celeryproject.org/) tasks
and use [django-celery](https://github.com/celery/django-celery/) to have a pretty UI of the tasks.

I was amazed on how easy it was to integrate celery with django. I just created a few tasks to
actually crawl blogs (I already had the code from my last post) and create some
[django actions](https://docs.djangoproject.com/en/dev/ref/contrib/admin/actions/) so the I can create
tasks by demand.

## Tasks

The `tasks.py` is below. Depending on if the blog is wordpress or blogspot I crawl the blog feed
differently, that way I can crawl not only the 10 most recent posts but the whole blog. So I created a few tasks
to discover the type of the blog. Then based on the type discover the feed URL to crawl.

For example wordpress blogs generally have the feed under: `http://mywordpressblog.com/feed/`.
This gives me only 10 posts if I want more I can request: `http://mywordpressblog.com/feed/?paged=2`
and that will give me a feed from post 11 to 20. Do this recursively and you get all the posts of the blog.
Something similar happens with blogspot.

Finally I created some simple tasks to convert the post content to lower-case and word-tokenization using
a new but pretty amazing library called [TextBlob](https://github.com/sloria/TextBlob)

```python
from celery import task
from django.conf import settings
from apps.blog_crawler import utils
from apps.blog_crawler.models import Blog, Post

import time
import urllib
import readability
from bs4 import BeautifulSoup
from text.blob import TextBlob


@task()
def lowerize(post_id):
    post = Post.objects.get(id=post_id)

    post.cleaned = post.cleaned.lower()
    post.save()


@task()
def word_tokenize(post_id):
    post = Post.objects.get(id=post_id)
    text = TextBlob(post.cleaned)

    post.cleaned = ' '.join(text.words)
    post.save()


@task()
def discover_type(blog_id):
    blog = Blog.objects.get(id=blog_id)

    kind = utils.discover_kind(blog.url)
    blog.kind = kind
    blog.save()


@task()
def discover_feed(blog_id):
    blog = Blog.objects.get(id=blog_id)

    if blog.kind is None:
        kind = utils.discover_kind(blog.url)
        blog.kind = kind
    feed = utils.discover_feed(blog.url, blog.kind)
    blog.feed = feed
    blog.save()


@task()
def crawl(blog_id, limit=10):
    blog = Blog.objects.get(id=blog_id)

    # Readability API
    parser = readability.ParserClient(settings.READABILITY_PARSER_TOKEN)

    # Create and start logger
    logger = utils.create_logger(urllib.quote(blog.url).replace('/', '_'))

    post_list = utils.get_posts(blog.feed, blog.kind, limit=limit)
    n_posts = len(post_list)
    logger.info('{0} ({1})'.format(blog.url, n_posts))

    # Start actual crawl
    for i, (url, date) in enumerate(post_list):
        if len(Post.objects.filter(url=url)) > 0:
            logger.info('{0}/{1} Already exists: {2}'.format(i, n_posts, url))
        else:
            parser_response = parser.get_article_content(url)

            try:
                soup = BeautifulSoup(parser_response.content['content'])
                content = soup.get_text(' ', strip=True)
                post = Post(url=url, content=content, date=date)
                post.save()
            except Exception as e:
                logger.info('{0}/{1} FAIL: {2}'.format(i + 1, n_posts, url))
                logger.info(str(e))
            else:
                logger.info('{0}/{1} OK: {2}'.format(i + 1, n_posts, url))
            time.sleep(3.6)
```

## Django Admin

Then just needed to create a django app with some actions to call the celery tasks. This allows me to have the
worker on a micro instance on EC2 and just queue the tasks using celery.
I used [rabbitmq](http://www.rabbitmq.com/) as the broker.

```python
from django.contrib import admin
from models import Blog, Post
from apps.blog_crawler import tasks


class BlogAdmin(admin.ModelAdmin):
    list_display = ['url', 'kind', 'feed', 'last_crawl']
    ordering = ['url']
    actions = ['discover_type', 'discover_feed', 'crawl']

    def discover_type(self, request, queryset):
        for blog in queryset:
            tasks.discover_type.delay(blog.id)
        self.message_user(request, 'Task(s) created')

    def discover_feed(self, request, queryset):
        for blog in queryset:
            tasks.discover_feed.delay(blog.id)
        self.message_user(request, 'Task(s) created')

    def crawl(self, request, queryset):
        for blog in queryset:
            tasks.crawl.delay(blog.id)
        self.message_user(request, 'Task(s) created')

    discover_type.short_description = 'Discover the type of the blog(s)'
    discover_feed.short_description = 'Discover the feed of the blog(s)'
    crawl.short_description = 'Crawls the selected blog(s)'


class PostAdmin(admin.ModelAdmin):
    list_display = ['url', 'date']
    actions = ['copy', 'word_tokenize', 'lowerize']

    def copy(self, request, queryset):
        for post in queryset:
            post.cleaned = post.content
            post.save()
        self.message_user(request, 'Content copied')

    def word_tokenize(self, request, queryset):
        for post in queryset:
            tasks.word_tokenize.delay(post.id)
        self.message_user(request, 'Task(s) created')

    def lowerize(self, request, queryset):
        for post in queryset:
            tasks.lowerize.delay(post.id)
        self.message_user(request, 'Task(s) created')

    copy.short_description = 'Copy the crawled content to cleaned'
    word_tokenize.short_description = 'Tockenize by words'
    lowerize.short_description = 'Lower-case the cleaned content'

admin.site.register(Blog, BlogAdmin)
admin.site.register(Post, PostAdmin)
```

## UI

The admin UI, using the [beautiful django suit](http://djangosuit.com/), looks like this.

![Home admin UI](/images/blog/2013/09/django-crawler/home_admin.png "Home admin UI")

Note: don't ask me why is I am using that blog to test

![Blog admin UI](/images/blog/2013/09/django-crawler/blogs_admin.png "Blogs admin UI")

![Posts admin UI](/images/blog/2013/09/django-crawler/posts_admin.png "Posts admin UI")

You can see the running tasks, or previous tasks.

![Tasks admin UI](/images/blog/2013/09/django-crawler/tasks.png "Tasks admin UI")

## Conclusion

I was pretty happy with this result. With very little effort I was able to build a quite complex
system. PostgreSQL for the database, rabbitmq + celery for message/tasks queuing and finally
Django for the UI. I can even create some

I consider this an example of why I choose python and its amazing community. The people working on
these projects are brilliant and are doing an amazing job. Focusing on building the basic tools so
people can build amazing stuff faster and easier than ever.

Some stuff I want to try next if real live allows me to is:

* [Haystack](http://haystacksearch.org/) + Solr for search
* MongoDB instead of Postgres. Apparently is *really* easy using [django-nonrel](https://github.com/django-nonrel/mongodb-engine)

As usual everything is on github: [django-crawler](https://github.com/danielfrg/django_crawler)
