Title: TGIK 003: Istio
Slug: tgik-003-istio
Date: 2018-07-14 12:03
Category: tech-notes
Tags: Kubernetes,Istio
Author: Daniel Rodriguez
url: tech-notes/tgik-003-istio
save_as: tech-notes/tgik-003-istio/index.html
video_id: WnDG-5cvEew
Rating: 2/5

Idea: You have services running in a microservice architecture and you want them to talk to each other.

In some organizations this type of work is done at the library level. Istio takes that and abstracts it as a service that runs as a sidecar in k8s so its independent of everything (libraries, language and more).

Based on [Envoy](https://www.envoyproxy.io/). Mainly driven by Google (plus some people from RedHat and IBM).

> Namespace: Used as a way to keep teams from stepping on each other toes. It allows a convenient way to attach quotas and security policies to a group of people.

Being a service it also allows to do more fancy stuff like metric collection. It allows it to do tracing using for example Zipkin. If done well you can see per request what components get hit.

Joe goes for a while on trying to get Istio running which is interesting but not a lot of information since he hit a reported a bug that wasted a lot of the video. The install is a little easier now.
