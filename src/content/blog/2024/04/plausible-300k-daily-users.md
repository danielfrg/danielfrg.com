---
title: "Self-hosting plausible for +350k daily users for $5"
slug: "plausible-350k-users-5usd"
pubDate: 2024-03-29
tags: [“analytics", “plausible", “cloud”]
summary: "you can replace Google Analytics"
---

I run a [couple](https://photera.app) [of](http://timeline.games) [popular](https://lapalabradeldia.com) web based games. Ok, one is popular the other are meh.
I have used Google Analytics since the very beginning to track usage of those websites, mostly because I have used Google Analytics for more than a decade.
My very first blogspot blog used Google Analytics but if I am being
honest Google Analytics sucks.

I don't think I ever understood their UI and when they changed from Universal Analytics to GA4 it got worse.
Most of the time I just want to check that things are working as expected
and answer simple questions:
“How many page views is the new version of the game getting?", "How many are coming from Spain?”, "How many are using this screen size?”.
If I wanted to do more, A/B testing or whatever I would use something else.

At the same time when these games became popular I always had in the back of my mind if I could get rid of it and replace it with a more privacy focus alternative.

[Plausible](https://plausible.io/) is the most common alternative when it comes to that.
The problem? It's paid. I would have no problem paying them 10 dollars per month but that only gives you 10k monthly page views.
My post popular game has 1.5 monthly million users and more than 3 million page views per month.
I would have to be in the 5 million page views per month plan of plausible which is 129 USD.
Thats too much for something that I get for free from Google specially compared to the revenue I get from Ads.
Keep in mind that while there are a lot of page views I don't run that many ads on them because the space for the game is limited, everyone plays on their phone, and in countries with low CPM.

## The Experiment: Self-Hosting Plausible on a Budget

I still wanted to run an experiment on self-hosting Plausible
and see how little can I pay to have a service that can handle the traffic of
the websites with similar (with some realistic non-google) guaranties.

First the easy part, installing plausible cannot be easier.
Just download their [community edition](https://github.com/plausible/community-edition/) and run their docker compose. It doesn't take more than 5 minutes if you know docker.

Now the tricky part. Paying as little as possible.

I of course started on EC2 with `t3.micro` and `t4g.micro` instances (2 vCPUs and 1 GiB of RAM).
This ran well for about 1-2 hours. After that they crashed, probably memory or disk pressure.
I didn't investigate much. The price for those would be around 8 USD per month (on-demand pricing).

I went up to `t3.small` which gives you 2 GiB instead of 1. It ran well for more than 24h and it passed the regular peak traffic of the websites (morning hours in Europe) so I considered it a win.

The problem? The on-demand price for a `t3.small` is a bit more than 15 USD per month and that goes above my 10 dollar imaginary threshold.

There are cheaper places to get hosting but at the same time you have to balance your time.
It has to be a company that will be here for a while, I don’t want to migrate this in 6 months. So using any VC funded startup free-tier plan is out.

So after a bit of exploring I decided to give [Hetzner](https://www.hetzner.com/) a try.
I knew about them from some twitter/X conversations and they also
[support terraform](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs),
so I can keep using all the same tools I already use for AWS.

Very important was also the price of 3.29 EUR (3.6 USD) for a 2 vCPU and 2 GiB. Cheap!

A couple of forms later I had an access/secret key pair, migrated my Terraform config and I was up and running.

I am happy to report I have been running this for a week and saw no issues what so ever.

Here are some charts of CPU usage and the traffic of the websites.

![](/blog/2024/03/plausible/hz-charts.png)

![](/blog/2024/03/plausible/plausible-charts.png)

Hetzner doesn’t show memory on their UI but I check it out manually every day and it was basically like this:

```plain
root@plausible:~# free
              total        used        free      shared  buff/cache   available
Mem:        1969704      742344      478116       73544      749244      972544
Swap:             0           0           0
```

The total price for this instance running for X days was: 1.59 EUR.

![](/blog/2024/03/plausible/hz-price.png)

Add one more dollar because Hetzner charges one dollar per month per IPv4 address.
I technically only needed this to setup the server because I expose it using
[Cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) so after that I could remove the IP but I kept in case something went wrong. To add/remove IP address you need to stop the instance and thats to much of a hassle.
If my ISP supported IPv6 I could easily save 1 extra dollar!

### Backups and stuff

Of course you want to back up this stuff but remember this
is not critical data. It doesn’t matter if it goes down for a couple of hours
while you recreate the instance and run ansible again to install everything.

You can backup this directly on Hetzner and it will cost "20 % of your server plan per month".
Math: `3.6 * 0.2 = 0.72` EUR per month. For a total of 7 rotating backups.
That sounds like a great deal to me.

![](/blog/2024/03/plausible/hz-backups.png)

I would personally also backup this to an S3 bucket with a simple nightly job.

### Unspoken costs

I know there are tons of unspoken costs of self-hosting services.

There are also tons of benefits of doing it.

Eventually this will go down and I will lose hours or maybe days of data.
While I go back to my desk and run terraform and ansible again or just bring back a backup.

That’s ok for this data.

Bad point for Hetzner: [They charge for power off nodes](https://docs.hetzner.com/cloud/billing/faq/#how-do-you-bill-your-servers).

They are still a lot cheaper than EC2.

### Other wins

Another fun thing you can do with plausible is send [custom events](https://plausible.io/docs/custom-props/for-custom-events). For the longest time I tried to setup [Google Analytics custom properties/dimensions/whatever](https://support.google.com/analytics/answer/14240153?hl=en).

The lag on this data on GA is bad. And getting reports is not just doing some SQL. I get it, they have so much data it’s actually impressive it works as fast as it does but in plausible it’s instant. I just process my data.

## Cloudflare: The Unsung Hero

Nothing would be possible if Cloudfare didn't cache everything.
I would probably have to pay a tons of ingress fees. They are be the real MVP here.

As mentioned earlier I also use CF tunnels to expose the service on a subdomain so no open ports. Another win.

The actual games fully static websites and are also hosted there on CF pages which is free.

Is everything free on CF? I think so.

## Will I keep running this?

For the games probably no.
I totally would if it was the only tracking thing I added to the websites.
For 5 dollars per month that's fine.

But the reality is that the websites are profitable because of Ads and they track everything. This would also be just another JS to load on the page. It makes no sense.

I might do it for the custom events mentioned earlier. We will see.

I will keep probably run another instance of this and migrate the tracking of my personal websites, documentation site for my OSS libraries and other stuff.

I do like that stuff is private. As tech people we should show others that this is possible and do our part.

If it costs less than 10 dollars of course, I am not stupid.

I also like to do this type of things. I host a bunch of services on my mini homelab so it’s fun for me.

## Other comments

- The latency of SSH’ing to Germany is noticiable
