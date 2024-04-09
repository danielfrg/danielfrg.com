---
title: "Jupyter-Flex"
slug: "jupyter-flex"
pubDate: 2021-04-15
tags: ["Jupyter", "Voila", "Dashboards", "React"]
summary: Easy dashboards for Jupyter
---

One of the advantages of working at places very opposed to what one is used to is all the
new ideas that can come out of interacting with new and different people.
For a person that coded (and loves) Python for years working at RStudio was a really
an interesting and eye-opening experience.
I was exposed to tools that I knew of but didn't understand well until I used them.

The presentation tools in R are quite amazing: [Shiny](https://shiny.rstudio.com/), [RMarkdown](http://rmarkdown.rstudio.com/) and [FlexDashboards](https://rmarkdown.rstudio.com/flexdashboard/)
have a lot of innovative ideas that we do not have (yet) in the Python world.

During that time [Voila was released](https://blog.jupyter.org/and-voil%C3%A0-f6a2c08a4a93?gi=af687f95c2d6)
as a way to make read-only Jupyter Notebooks connected to live kernel that allows for
interactive dashboards and reports.
Voila is relatively simple based on Jupyter server and great piece of technology, one thing that it lacks
(as it happens in Python) is a little bit of love for UI and UX.

I decided to make a small contribution to the ecosystem and adapt
[FlexDashboards](https://rmarkdown.rstudio.com/flexdashboard/) from R
to the Python and Jupyter ecosystem into [Jupyter-flex](https://jupyter-flex.danielfrg.com/).

The project has been open-source since the beginning and there have been some interesting uses already.
Thanks to everyone who has sent me emails with what you have built!

Now that the project is more stable I wanted to make an official blog post.

![Jupyter-flex](/images/jupyter-flex.png)

It initially started as an awful gigantic Jinja template and now it's a React application.
I tried to use standard modern web development technologies to make the project
more up-to-date with the web world have. Hopefully, this makes the project more maintainable and
maybe even attracts some contributions outside of the Python world to make it even better.

While I am not a designer I have always had a bit of good taste
and enough patience to steal CSS from a lot of places and I am happy with the results.

Jupyter-flex is also available as a regular [nbconvert](https://nbconvert.readthedocs.io/en/latest/)
template. While I love Voila and interactive dashboards I believe that most
reports can be static since data is not always changing.
So jupyter-flex supports bundling the dashboards into a single `.html` file that can be easily hosted and shared.

You can simply install it using pip:

```
pip install jupyter-flex
```

Take jupyter-flex for a test by looking at the documentation [jupyter-flex.danielfrg.com](https://jupyter-flex.danielfrg.com/)
and let me know any use cases and issues on GitHub: [danielfrg/jupyter-flex](https://github.com/danielfrg/jupyter-flex)
