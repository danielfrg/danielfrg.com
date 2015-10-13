Title: New blog using Jekyll & iPython
Slug: new-blog-using-jekyll-and-ipython
Date: 2013-1-31
Tags: Jekyll,IPython,Python
Author: Daniel Rodriguez

Recently I restart my blog by moving from wordpress.com to github pages the reason is than about two weeks ago I found a blog on a github page using [octopress](http://octopress.org/) ([jekyll](https://github.com/mojombo/jekyll)) and after reading 20 minutes I immediately wanted to use it and decide to switch. Wordpress is a good piece of software but wordpress.com is not, my complaints are.

* Is not fast enough
* Can't have custom analytics and the wordpress analytics sucks.
* Can't modify HTML or even CSS
* Don't have markdown support

Jekyll has all of that and nd github pages for hosting is just magnificent. Publish a new post with git is how [a hacker](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html) should do it.

I tried to find a python alternative, there are some specially [Hyde](http://ringce.com/hyde) but the github page shows that the last commit was 2 years ago, while jekyll is actively developed and a much better alternative. At the end of the day it is not necessary to use ruby which is good because I have no idea about it.

And the most interesting part is that it adapts to any person/environment. For example can use only markdown but my past three posts have been done with [iPython notebook](http://ipython.org/ipython-doc/dev/index.html) and then converted to html. Which is just an amazing way to share, and at least 10 times faster than copy/pasting code to Wordpress.

So i decide to design my own blog using jekyll. I discard octopress because I wanted to be a more customized site and really is not necessary.

## Design

I am not a designer so I use [Bootstrap](http://twitter.github.com/bootstrap/) and take inspiration from some site (that is copy a lot of CSS). I tried to learn haml but did not work for me, instead I prefer the zen-coding plugin. Finally I use [Less](http://lesscss.org/) with a Jekyll plugin to do the CSS.

## iPython notebook

I use a little modified version of this [code](http://jakevdp.github.com/blog/2012/10/04/blogging-with-ipython/) to convert an iPython notebook to HTML and added it to Jekyll without messing the CSS of the blog: [Blogging With IPython in Octopress](http://jakevdp.github.com/blog/2012/10/04/blogging-with-ipython/)

The only modification I did was to merge two commands into one, because I am that lazy.

## Plugins

Github pages support Jekyll but not some of its plugins such as the [LESS](http://lesscss.org/) plugins. There is a very simple workaround for that. Just have to run Jekyll locally with all the plugins you want, and then just upload the compiled HTML,CSS,JS,... to the repository and github will display the static/compiled content.

So in my repository I have all the templates, posts, images, markdown, and everything else on folder named `source`; that way jekyll creates the static content into `source/_site`. Then when I am happy with new post or new design I use a very simple python [fabfile](http://fabfile.org/) to clean the root (ignoring the `source` and `.git` folders) then it moves the contents of `source/_site` to the root of the repository, then commits the changes and finally clean the root again.

I try to make the site plugin agnostic because I don't now ruby but I try to complement that with a few YAML tags and if's on the layous, for example only have to put a YAML tag on each post file and the picture is added automaticly to the index and post pages. That also happens with youtube and vimeo videos.

Finally the source of the site is on [github](https://github.com/danielfrg/danielfrg.github.com) if anyone want to take a look.
