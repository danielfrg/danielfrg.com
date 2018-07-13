Title: Month-Log.oct.2013
Slug: month-log
Date: 2013-10-31
Tags: Month-Log,Python,Pig,Nutch,Crawling,Vagrant,Salt,Luigi
Author: Daniel Rodriguez

I've been busy with real work to write any specific posts for the blog but I realize it was
a productive month. I worked a lot and learned quite a few things and  new technologies and
I have some thoughts about them, I usually use twitter to share simple thoughts but they usually get
lost on the noise.

So I am going to start a monthly series in which I discuss a little bit about what I have done that month.
Hopefully mixing with regular posts I am hoping that this makes me learn more and more stuff every month so I have something to write about. On this case is October and a few weeks of September.

## Books I read

I had to do some [pig](http://pig.apache.org/) for my job so I used this opportunity to
consolidate a little bit my knowledge.
I had worked with pig a little bit before thanks to [Coursera Data Science](https://class.coursera.org/datasci-001/class) course but this time I went
to the source and read [Programming Pig](http://shop.oreilly.com/product/0636920018087.do) by O'reilly.

I highly recommend the book to anyone starting with pig but as every technology there is
nothing as getting the hands dirty and do real stuff. The book gives you the foundation you need
and gets in enough depth so you can write **and understand** latin pig scripts.

I also learned how to run a pig job using a jython UDF on EMR, after some try and error I found the solution
and put it on a [gist](https://gist.github.com/danielfrg/7220473).
I found that the people of [mortardata.com](http://www.mortardata.com/) do the same but with *real*
python so one can use all the libraries available (e.g. NLTK).
(FYI they open source their code and is on the new version of pig, 0.12)
I cannot recommend enough [mortardata.com](http://www.mortardata.com/) just create an account and be amazed.

## Nutch

I had to do a lot of crawling this month. The universal solution on this case is
[Apache Nutch](http://nutch.apache.org/).
It was not the most pleasant experience to be honest. It gets the job done? Yes. Do I like it? No.

The best part of Nutch is that is "easy" to run it on top of Hadoop and distribute the load
and maybe I just don't like it that much because I haven't been able to clean all the data as I want
and I am blaming Nutch. Another option is [scrapy](http://scrapy.org/).

## Vagrant and Saltstack

I had finally decided to try [vagrant](http://www.vagrantup.com/) and I love it. I regret all the time
that I knew about its existence and didn't read about it.

The idea is create a **clean** virtual box based on a bootstrap so one can know **exactly** the
requirements to run every project. Then is possible deploy it to EC2 using a
simple command so the *same* box will be available online. I was so happy that I could develop
and deploy in the same box. It feels clean.

Then we have [chef](http://docs.opscode.com/) or [salt](http://www.saltstack.com/).
With chef recipes or salt modules one can setup not one virtual local machine but a thousand boxes
on the cloud using the same configuration file.
The magic occurs when vagrant uses chef recipes or salt modules to create the VM. Development
and deployment using the same configuration. Amazing.

As a pythonista it was easy to choose salt on top of chef (ruby) but I also read [this](http://www.linuxjournal.com/content/getting-started-salt-stack-other-configuration-management-system-built-python)
and I was convinced.

I just got started with those technologies but I am very exited and cannot wait to use them more and more
to make my work more deployable and production ready.

I am also keeping an eye on [docker](https://www.docker.io/).

## Luigi

[Luigi](https://github.com/spotify/luigi?source=c) is a small project to create pipelines in python.
It doesn't try to solve parallelization: it includes support for Hadoop. It doesn't try to solve
task scheduling or distribution: [celery](http://www.celeryproject.org/) exists.

Is solves a very specific problem and it was designed with data pipelines in mind. Is a young
project but it is developed but guys at spotify and I can see a bright future.

Also the pipeline structures makes code very clean, easy to understand and debug.

I did a couple of examples and put them on gists:

- [Clean HTML and Index it into Solr](https://gist.github.com/danielfrg/7091876)
- [Merge files in HDFS and count a json field](https://gist.github.com/danielfrg/7091940)
