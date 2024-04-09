---
title: "NBViewer.JS"
slug: "nbviewer-js"
pubDate: 2021-04-01
tags: ["Jupyter", "Apps", "React"]
summary: Pure Javascript Jupyter notebook viewer
---

As a long time Jupyter user that has hundreds of `.ipynb` files on my GitHub repos
I have always hated the way GitHub renders notebooks.
They have made a lot of improvements (that I appreciate) and now it just fails like 30% of the time
instead of 80% like before, especially with medium size to big notebooks.

I am not sure how they implemented this internally but based on the styles and other hints it probably's just
calling [nbconvert](https://nbconvert.readthedocs.io/en/latest/).
The main issue with that approach is that this requires a Python process to convert the notebooks to `html`.
This is fine if you work locally but when you have millions of Jupyter Notebook files this aproach can become hard to scale.

I think most of us fall back to the Jupyter implementation of this at [nbviewer.jupyter.org](https://nbviewer.jupyter.org/)
instead, a notebook fails to render on GitHub.
I think this just works better because there are more servers of NBConvert.

There is no reason to require a Python process to convert the JSON based `ipynb`
format to an `html` other than it's the main implementation
and that it would be annoying to build all the Jupyter Notebook components in JS.

After building [Jupyter-flex](https://jupyter-flex.danielfrg.com/) based on [nteract components](https://nteract.io/)
I realized how all the tools were already there!
It was a very low-hanging fruit to write a pure JS Jupyter Notebook renderer.
That's what [NBViewer.JS](https://nbviewer.danielfrg.com/) is:
It renders a Jupyter Notebook `ipynb` directly in your browser, with no servers and no Python required.

[![NBViewer.JS](/images/nbviewerjs.png)](https://nbviewer.danielfrg.com/)

Fun extra features is that it also supports rendering [Jupyter-flex](https://jupyter-flex.danielfrg.com)
dashboards. This will of course not be connected to a Kernel but static notebooks will work.

While this implementation is not perfect, for example, it only works with Notebook version v4
there is no reason it cannot be more feature complete with a bit more of work.

Hopefully, the Python data science community can adopt more of these new modern web technologies.
If [nbviewer.jupyter.org](https://nbviewer.jupyter.org/) runs nbconvert servers
it would be possible to save some hosting by having a client-only implementation.
And maybe even GitHub could use a similar approach to make Jupyter user's experience better.
