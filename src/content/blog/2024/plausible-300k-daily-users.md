---
title: "Self-hosting plausible for 300k daily users for $5 dollars"
slug: "plausible-300k-users-5usd"
publishDate: 2024-04-15
tags: ["Analytics", "Plausible", "", "React"]
summary: tl;dr you really don't need that much to replace google analytics
draft: true
---

I run a [couple](https://photera.app) [of](http://timeline.games) [popular](https://lapalabradeldia.com) web based games.
I have used Google Analytics since the very beggining to track usage of those websites,
mostly because I have used Google Analytics for more than a decade.
My very first blogspot blog used Google Analytics but if I am being
honest Google Analytics sucks.

I don't think I ever understood the UI and when they changed from Universal Analytics to GA4 it got worse.
Most of the time I just want to check that things are working as expected
and answer simple questions: "How many page views is the new version of the game getting?",
"How many are coming from Spain", "How many are using this screen size".
If I wanted to do more, A/B testing and whatever I would use something else.

At the same time when these games became popular I always had in the back of my mind if
could get rid of it and replace it with a more privacy focus alternative.

[Plausible](https://plausible.io/) is the most common alternative when it comes to that.
The problem? It's paid. I would have no problem paying them 10 dollars per month
but that only gives you 10k monthly pageviews.
My post popular game has 1.5 million users and more than 3 million page views per month.
I would have to be in the 5 million page views per month plan of plausible which is 129 USD.
Thats to much for something that I get for free from Google specially compared to the revenue I get from Ads.
Keep in mind that while there are a lot of pageviews I don't run that many ads on them because the space for the game is limited, everyone plays on their phone,
and in countries with low CPM.

## The experiment

I still wanted to run an experiment on self-hosting Plausible (it's OSS)
and see how little can I pay to have a service that can handle the traffic of
the websites with similar (but realistic non-google) guaranties.

First the easy part, installing plausible cannot be easier.
Just download their [community edition](https://github.com/plausible/community-edition/)
and run the docker compose. It doesn't take more than 5 minutes if you know docker.

Now the tricky part. Paying as little as possible.

I of course started on EC2 with `t3.micro` and `t4g.micro` instances (2 vCPUs and 1 GiB of RAM).
This ran well for about 1-2 hours. After that they crashed, probably memory or disk preassure.
I didn't investigate much. The price for those would be around 8 USD per month (on-demand pricing).

I went up to `t3.small` which gives you 2 GiB instead of 1. It ran well for more than 24h
and it passed the peak traffic of the websites so I considerd it a win.

The problem? The on-demand price for a `t3.small` is a bit more than 15 USD per month.
That goes above my 10 dollar imaginary treshhold.

There are cheaper places to get hosting but at the same time I had to balance
picking a serious company. So after a bit of exploring I decided to give [Hetzner](https://www.hetzner.com/)
a try. What convinced me was a bit of twitter/X talk i saw at one point and the
fact they [support terraform](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs),
so I can keep using all the same tools I already use for AWS.

Also the price for a 2 vCPU and 2 GiB for 3.29 EUR or 3.6 USD. Cheap AF!

A couple of forms later I had an access/secret key pair, migrated my Terraform config
and I was up and running.

I am happy to report I have been running this for a week and saw no issues what so ever.

Here are some charts of CPU/Memory usage and the traffic of the websites.

The total price for this instance running was about

Fun fact: Hetzner charges one dollar per month per IPv4 address.
I technically only needed this to setup the server because I expose it using
cloudflare tunnels so after that I could remove the IP but I kept it.
If my ISP supported IPv6 I could easily save 1 extra dollar!

### Backups and stuff

Of course you want to back up this stuff but remember this
is not critical data. It doesnt matter if it goes down for a couple of hours
while you recreate the instance and run ansible again to install everything.

You could backup this directly on Hetzner and it will cost " 20 % of your server plan per month".
Math: 3.6 * 0.2 = 0.72 USD per month. For a total of 7 rotating backups.
That sounds like a great deal to me.

I would personally also backup this to an S3 bucket with a simple nightly job.

## Unspoken costs

I know there are tons of unspoken costs of self-hosting services.

There are also tons of benefits of doing it.

Eventually this will go down and I will lose hours or maybe days of data.
While I go back to my desk and run terraform and ansible again or just bring back
a backup.

## The other key player: Cloudflare

Nothing would be possible if Cloudfare didn't cache everything.
I would probably have to pay a tons of ingress fees. They are be the real MVP here.

As mentioned earlier I also use CF tunnels to expose the service on a subdomain
so no open ports.

The actual games are also hosted there on CF pages which is free.

Is everything free on CF? I think so.

## Will I keep running this?

Not for the games. I totally would if it was the only tracking thing I added to the websites.
For 5 dollars per month that's fine.
But the reality is that the websites are profitable because of Ads and they track
everything. So it makes no sense.

I will keep running this and migrate the tracking of my personal websites,
documentation site for my OSS libraries and other stuff.

Because of privacy? Yes and no. I like self hosting this stuff and honeslty
liked the simplicity of Plausible.

