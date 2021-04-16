+++
title = "Demucs App"
slug = "demucs-app"
date = "2020-10-10"
tags = ["ml-models", "apps", "music"]
author = "Daniel Rodriguez"
+++

Music has always been one of my hobbies.
I play a little bit of piano and more recently I picked up the Ukulele.

When I see any ML advances in music processing I get very excited.
I remember seeing [Demucs (Music Source Separation in the Waveform Domain)](https://github.com/facebookresearch/demucs)
a while back but it wasn't until my favorite music YouTuber [Jaime Altozano](https://www.youtube.com/channel/UCa3DVlGH2_QhvwuWlPa6MDQ)
made [a video about it](https://www.youtube.com/watch?v=4_l31Vucrmo)
that I decided to make an online app to make this available to people.

The app is a very simple React app that uses [Algorithmia](https://algorithmia.com) to get
some free processing power, the service is very easy to use and allows us to make these kinds
of apps very easily.

You can just upload any song and the app will split the source into 4 tracks: Bass, Drums, Other, and Vocals.

[![Demucs](/images/demucs.png)](https://demucs.danielfrg.com)

I have started to use this personally to practice some songs with the original
bass and drums track while I play on my instruments.

Check it out at: [demucs.danielfrg.com](https://demucs.danielfrg.com)

PD: Design is inspired by Evangelion as I was rewatching it recently.
