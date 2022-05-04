---
title: "Notes: You can't do data science in a GUI"
layout: ../../../../layouts/BlogPost.astro
slug: you-cant-do-data-science-guy
publishDate: 2018-07-07T14:00:00Z
tags: ["Tech notes", "R", "Python"]
author: Daniel Rodriguez
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/cpbtcsGE0OA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Challenge of DS: Taking a vague question and making it precise enough that you can answer and use it qualitatively

Import data -> make it tidy -> Job as DS is to understand the data

Understand is a loop of:

1. Transforming: Create new variable & summaries
2. Visualizing: Surprises but doesn't scale
	1. You can start with a vague question and the viz will help you
	2. You can see something you don't expect
	3. Don't scale because there is a human in the loop
3. Model: Scales but doesn't fundamentally surprises
	1. Makes assumptions that cannot break, so it cannot surprise you

After understanding you want to:

1. Communicate - with a supervisor or whatever
2. Automate - how to deploy

Why program if i want to do DS?

- What do you do in a DS problem: Think it  (what are you going to do) -> Describe (precisely) it (The computer can understand) -> Do it (Computer runs it)

Two extremes:

1. Excel: you can see what you can do but you are constrained
2. You don't see whats possible (blink cursor) but you are free to

Programming languages are languages - you can express your thoughts in it
It can be hard to express thoughts (code/text makes it easier)

Coding is just text:

- Allows you to copy paste. Readable, Diffable, Reproducible, Open, Sharable, share (email, tweet it).
- Thanks to that tools like Stack Overflow and Github exist and are amazing
- Narratives (using code) using Notebooks and Rmarkdown
- Combine pieces to solve bigger problems

As data changes code just need to run again and everything feels into place.
- If you use word, you have to re run the analysis and copy-paste images and make everything again by hand

In a GUI: You live in fear of clicking the wrong thing and making it permanent since its hard to roll back

## Why use R

R is a vector language

Missing values included

- This logic can be tricky

Data Frame (table) included

Functional programming

- You work with it by concatenating functions and doing stuff with functions
- This is a good fit for DS

Meta-programming

Allows you to create DSLs that allows to express thing in different ways for different tasks (e.g. plotting and cleaning data)

> No matter how complex and polished the individual operation are, it is often the quality of the glue that most directly determines the power of the system - Hal Abelson

## GUI

Some things are hard to express in code (or maybe just a painful): like changing variables names
UI plugins that are tied into code (or produce code) are useful for this can of stuff

Autocomplete is key

## Summary

1. Huge advantages to code
2. R provides great environment - Doesn't mean Python sucks! :)
3. DSLs help express your thoughts
4. Code should be the primary artifact (but might be generated other than typing)
