---
title: "word2vec app with Algorithmia"
slug: "word2vec-app-algorithmia"
date: 2018-09-09
tags: ["ML Models", "Algorithmia", "word2vec", "Vue.JS"]
---

Back in 2013 (time really flies) just after [Google released word2vec](https://code.google.com/archive/p/word2vec/)
I wrote a [small wrapper library](https://github.com/danielfrg/word2vec) around it and wrote a [blogpost + small app](/blog/2013/09/word2vec-yhat/) to query a pretrained model deployed in YHat.
Since [YHat was adquired by Alteryx](https://www.alteryx.com/press-releases/2017-06-05-alteryx-acquires-yhat-accelerate-data-science-model-deployment)
in 2017 this app stopped working.

So I decided to rewrite this app this time using [Algorithmia](https://algorithmia.com/) which is an amazing service
to deploy machine learning models and expose them as a REST API.

Algorithmia integrates with a Data Science workflow in the right places using Git and language specific clients.
Every algorithm is a Git repo and you can clone it to work on it locally or edit in their editor UI.
Creating an endpoint is as eassy as writting an `apply` function in basically any language.
It automatically picks dependencies and builds the models, handles versioning and you can upload pretrained models
or connect to external sources.
**It's quite an amazing service.**

The endpoint is deployed in algorithmia as [danielfrg/word2vec](https://algorithmia.com/algorithms/danielfrg/word2vec)
and you can find docs there and even make sample queries from their UI (I love that!).

After that I decided to rewrite the app using [Vue.JS](https://vuejs.org/) and the [Algorithmia JS client](https://algorithmia.com/developers/clients/javascript/).
It's just an static page I deployed using [Netlify](netlify.com). Code for the app is on GitHub: [danielfrg/word2vec-app](https://github.com/danielfrg/word2vec-app).

You can find the app at [word2vec.danielfrg.com](https://word2vec.danielfrg.com/).
It allows you to do some simple queries for word similariy and analogies and it looks like this:

![](/blog/2018/09/word2vec-algorithmia/word2vec-app.png)

I am quite amazed by Algorithmia and can't wait to deploy more models.
Services like Algorithmia that combined with amazing free static hosting from Netlify is a great way to deploy
Machine Learning applications for free :). Special shout to to Vue.JS for being what I always wanted in a JS framework.
