---
title: "I Vibecoded my ideal task manager"
slug: "things-vibe-coded"
pubDate: 2026-01-22
tags: ["ai", "vibecode"]
summary: "The clone of Things I always wanted"
---

I have been using [Things](https://culturedcode.com/things/) for more than a decade. I love it. It's pretty much perfect. Even my wife is like: "Add this to Things."

My only issue is that it's restricted to Apple devices. While I mostly run Apple devices, as MacOS goes to hell and I move towards Linux, I end up missing Things.

At the same time, now that AI agents are a thing (and as I build one for myself), I wanted to integrate my task manager with more services: n8n, Home Assistant, or even just AI Agents calling it as a tool. There are hacks, even a [CLI for Things](https://github.com/thingsapi/things-cli), but I wanted a better solution.

I always said that at some point I would take a month to code one myself: a web version with (almost) the same UI and workflows as Things, but with an API, a CLI, and so on. With Coding Agents, it took about a week totally on the side, just burning tokens as I worked, watched movies, and fed the baby.

## They have seen this code

It's a to-do app. There are millions of them out there, so we know the LLMs know how to build one, right? It's surprising how many stupid mistakes they make. The first one or two you are like, "Yeah, whatever..." but as the complexity grows, the quality drops dramatically with every prompt to change the padding of an item.

Suddenly you end up clicking on a button and something random pops up or moves, or titles of an app don't change—or they change while changing something else. And you are like, "How is that even possible?"

Then you inspect the code a bit and you see so much duplicated code and 5 `useEffect`s that go against each other. It's great! (Not). Of course, you don't want to fix any of that yourself because the code is shit. So you just pull the AI lever and hope for a 7-7-7.

It took me thousands of tokens to remove a bit of that feeling of the app being vibecoded. For sure, it took me less time than coding it myself, but multiple times I had to be like, "No no, this is the pattern I want for drag and drop" and I had to regen the whole app again.

I learned a lot about the current state of coding agents. How to make them do stuff,
what they need to produce what I want.
I like my app; I have been using it for 2 weeks and I plan to continue using it and burning more tokens as add more stuff.

I call this experiment a success. I have an app for myself that I can customize to whatever I need. At one point I will add a TUI and add minor stuff I wanted in Things. It's fine for me.

This is clearly what's going to happen to software engineering. 
The issue I see is that quality was already terrible, just look at MacOS and Windows.

Things by Culture Code is a polished app. It is so well designed; every animation is tested and intentional. This was rare before, but in the age of AI agents, this is going extinct.

You can find the code here: [danielfrg/things](https://github.com/danielfrg/things).
I self hosted it on my homelab.
