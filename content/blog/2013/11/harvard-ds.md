Title: Review: Harvard Data Science - Fall 2013
Slug: harvard-ds
Date: 2013-11-23
Tags: Python,Data,NLP,Statistics,Bayesian,Graphs
Author: Daniel Rodriguez

A few weeks/months ago I found on HackerNews that Harvard was publishing all their [Data Science course content](http://cs109.org/) (lectures, videos, labs, homeworks) online. I couldn't miss the opportunity to find what are they teaching, it was a nice experience to see how much I have learned and what else I am missing. Also, when I saw that everything was on python I knew they are doing it right!

The homeworks are IPython notebooks, the books are what I consider every Data Scientist should read: [Python for Data Analysis](http://shop.oreilly.com/product/0636920023784.do), [Machine Learning for Hackers](http://shop.oreilly.com/product/0636920018483.do), [Probabilistic Programming and Bayesian methods for Hackers](http://nbviewer.ipython.org/urls/raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Prologue/Prologue.ipynb).

The homeworks were amazing and useful, I haven't seen all the videos (yet) but the ones I did were amazing. Below I do a little review of each homework, the stuff I learned and stuff that I think should be different.

Initially I wanted to use this opportunity to get into [Julia](http://julialang.org/), but the amount of libraries that are available on python and not on Julia was to high for me to drive me back into python (once again).

## Homework 0

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW0/HW0_mysolution.ipynb)

Basic introduction to python and some of it scientific libraries.

Things I changed:
Use beautifulsoup4 instead of 3, not sure why they decided to go with an deprecated version.

## Homework 1

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW1/HW1_mysolution.ipynb)

The main idea was to scrape data from the web, in my opinion one of the most important things a Data Scientist can do is to grab its own data, it gives a big boost to analysis if the person responsible for the analysis decides upfront what data is needed. Is doesn't need to be perfect at first, but usually helps **a lot**.

The final problem shows the properties of bootstrapping, a must know. Also some simple problems to get started with matplotlib.

I knew about [pattern](http://www.clips.ua.ac.be/pattern) but never had the chance to play with it. I learned that includes a xml/html parser that creates a DOM so one can access the different fields/tags, I usually use [beautifulsoup](http://www.crummy.com/software/BeautifulSoup/bs4/doc/) for html and [lxml](http://lxml.de/ ) for xml but is nice to have an alternative.

I had no idea about [fnmatch](http://docs.python.org/2/library/fnmatch.html), I always used regular expressions but I think that for simple matching tasks I am going to use fnmatch from now own and hopefully will save me some time.

## Homework 2

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW2/HW2_mysolution.ipynb)

A basic introduction to statistical models by doing a predictions the Obama campaign, very interesting exercise. I felt like Nate Silver and it was kind of the idea, show that is possible to do a simple but useful prediction doing a reasonable amount of work. As with a lot of work with data usually the 80% gets done in 20% of the time but the remaining 20% takes the remaining 80% of the time.

What I changed:

1. Used scipy.stats for probability calculations instead of doing those myself. DRY.
2. I tried the new ggplot for python to do some of the plots faster, worked perfectly

## Homework 3

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW3/HW3_mysolution.ipynb)

Interesting problem of making a simple prediction of movies reviews intro two categories (fresh or rotten).

I liked the problem but I think it would be a good idea to use [NLTK](http://nltk.org/) instead of hand writing some of the functions and doing a hand made classifier using scikit-learn. I realize that it is **really** easy to do it using the Vectorizer and Naive Bayes classes and I had never done it before so it was a good learning experience, but an introduction to NLTK would be nice.

The example is very easy to reproduce in NLTK as NLTKs author [showed in his blog](http://streamhacker.com/2010/05/10/text-classification-sentiment-analysis-naive-bayes-classifier). Is an old post but I was able to reproduce the results a few months ago and I was amazed by the results of a simple sentiment classifier. I believe the course missed an opportunity to teach this.

I liked the cross-validation and specially the **model calibration** sections. Also the rotten tomatoes API is a pretty good source of data.

## Homework 4

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW4/HW4_mysolution.ipynb)

For sure the most interesting homework. Not only a nice collaborative filtering problem (with some bayesian analysis) but also an introduction to MapReduce jobs on hadoop using MRJob. I never used MRJob before so it was nice to use it for the first time **but** I don't think it will replace my love for  [luigi](https://github.com/spotify/luigi).

[Luigi](https://github.com/spotify/luigi) is a nice and small library form the guys at spotify. It comes with hadoop support built in but at the same time can be extended to any kind of data jobs (e.g. postgres or simple text files). Since I found about luigi I have been writing a lot of code as pipelines and I could not be happier.

MRJob killer feature is EMR support that luigi does not have currently. Another nice feature of MRJob is the first class documentation. Luigi on the other hand is limited to a Readme file and you will have to read the source code to discover some features, but it is worth it.

I have to say that MRJob is very easy and to **MapReduce only** jobs is the way to go, I highly recommend it.

My knowledge about collaborative filtering was (and still is) **very** limited so I only have to say that I loved to learn about it!

## Homework 5

[My solution](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/harvard-cs109-fall-2013/master/homeworks/HW5/HW5_mysolution.ipynb)

Graphs was always that topic that for some reason I haven't dive into yet, but is definitely in my thing to learn list. So I took this opportunity to learn everything I could by watching the lectures and doing the homework.
I also grabbed a copy of [graph databases by O'reilly](http://graphdatabases.com) from the university library and I am very exited about it, I am a little behind on my reading so it might take a while.

The homework was about the congress and the relation between them. Nothing fancy but interesting.
Second homework that is about politics, I guess that the data is available but it would be nice to chose a different topic.

## Conclusion

The objective of learning new stuff was accomplished. The course gave me perfect introduction to a variety of topics and I have more clear ideas on how to proceed from now own.

I had a lot of fun doing the homeworks, I learned a lot of stuff I didn't knew before. The statistics sections were a little bit hard for me but that was the idea.  I felt really comfortable with a lot of the tools used so I know I am doing it right. Finally, now I know in what I need to focus more.

The main conclusion I got is that there is still a lot to learn and the Data Science space keeps changing every day, that is the reason I like it: When I think I am good at something, I realize I am just getting started.

Thanks to Harvard for publishing all the content online.
