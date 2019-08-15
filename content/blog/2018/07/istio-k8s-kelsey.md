---
title: "Notes for: Istio and Kubernetes"
slug: istio-and-k8s
date: 2018-07-14T13:00:00Z
tags: ["Tech notes", "Kubernetes", "Istio"]
author: Daniel Rodriguez
---

{{< youtube id="s4qasWn_mFc" class="video" >}}

Istio goal is to make easy to: have policy between your applications, have observability, security per application instance and reliability.

You can do them without istio - most of the time with code changes. Istio uses sidecar pattern to add functionality to the application stack.

Most people who are managing infrastructure just want a PaaS. Why are they building it themselves? Even if they don't want to reinvent the wheel the truth is that most PaaS don't do all you need, maybe its 70% and have to write glue code. Kubernetes and Istio are pieces to the puzzle that help you build the platform you want.

Developers believe Ops people have everything in order. "You write apps and you ship them,, everything is consistent."

New tools gave us new ways to package. Docker allows you to have that to have a better contract, could be Python, Go, whatever. Its independent of the language, OS and do repeatable. Works on a Laptop or a Server. How do I manage it around a cluster? Mesos or Kubernetes.

Kubernetes: Take your container images and gives you an application API across your machines. Gives you reliability (your app is always running) and collects some metrics (that the kernel knows about: CPU, memory, but not details).

Kubernetes is not a complete platform. what about:

- Visibility? Istio
- Secrets at a detail level on the applications? Vault
- Details about the requests? Success vs failure? Prometheus
- Tracing? Zipkin
- Applications credentials (app needs access to DB)? Spiffe

Image a function that is 6 lines of code. To add one of this things it will maybe become 25 lines of code. No one will add those lines.

How can we do this things a way that is cross language, cross teams, cross organizations?

In k8s we make people stop talking about nodes and start talking about deploying applications.

## Istio

Is constructed a lot like k8s. A control plane. Agents that enforce some policies.

> Kubernetes we talk about what to run and in Istio we talk about how to protect and secure the things that are running.

It uses a sidecar pattern.  So the application developer doesn't need to add anything to get the benefits.

It uses Envoy. Envoy has the ability to integrate with the service discovery of k8s, Consul or etcd, it knows who to proxy GRPC, HTTP 1.1 and HTTP 2. So you can put it in front of everything.

The Mixer: If you see an HTTP request between two applications, you can get that data and thought it to Zipkin or Prometheus.

It includes an ingress controller (based on Envoy). It will replace the LoadBalancer types that get created on the cloud. You can have the same load balancer onprem, on the laptop and in the cloud. You will still have an ELB or Google one int he cloud for HA.

The CA. Emits certificates for each of the applications so when the apps come up they will get its own certificate and it will be pushed to a sidecar. It will rotate the certs so they are short lived. You end up with TLS mutual auth between all your components and they can use for authentication.

## Demo

Istio needs to inject the sidecar containers into the k8s pods. So you either have to:

1. run the `istio-sidecar-injector` deployment and set it to automatically do that based on a label (`istio-injection=enabled`)
2. use the `istioctl kube-inject` command that basically outputs a new k8s resource and apply that new resource

The pods can still talk to other pods via the service dns names like if Istio is not there but Istio will take that traffic and do magic stuff.

Add a new ingress rule with the annotation: `kubernetes.io/ingress.class: istio`  so that the Istio integration kicks in.

When you do a request:

1. You curl the ingress entry: e.g. `<ip-addr>/ping`
2. The ingress routes it to the frontend (app)
3. The frontend passes the traffic to a sidecar
4. Traffic goes to the mixed and it gets sent to the backend sidecar
4. It goes to the backend sidecar, that sidecar passes the traffic to the backend

Since everything goes through the mixer we immediately start seeing data on the Grafana (prometheus), Zipkin and graph of the application (dependencies).

Istio allow us to do stuff like traffic shaping: Decide which endpoints see what traffic. Add policies that deny traffic, e.g. the frontend cannot talk with a specific backend.

### Denial rules

This work with a simple file (like k8s) that target objects based on k8s labels. Then you use the `istioctl`

	istioctl mixer rule create global bar.default.svc.cluster.local -f <file.yaml>

After setting the rule requests start to fail and we can see them in Grafana and Zipkin. After we remove the rule everything starts to work again, no need to restart anything!

Kubernetes makes it easy to deploy but you had to rely on Cloud provider specific stuff to do security, firewall and other stuff outside k8s. Istio allows is to do inside the cluster.

### Route rules

k8s allows to do rolling upgrades and downgrades. but what if you want to first test an update on 10% of users, or maybe only to mobile clients. k8s cant do that Istio can.

Using route rules you can use for example match headers of requests and route them to a different version.

Istio allows you do to stuff like retries automatically (with timeouts) in case a service is maybe down for a second but it comes up again, instead of failing retry a couple of times.

For an upgrade:

1. Deploy v2 of the backend (with the istio inject). Now you have v1 and v2 running.
	- At this point frontend requests will bounce between v1 and v2, maybe its ok but probably not. To prevent this mistake we should set a rule that makes all requests always go to v1 (weight: 100).
2. Now we can have another rule that makes mobile clients to go to v2, to make it have a higher priority than the always v1 rule we set `precedence: 2`

The power of the sidecar is that the rules will be respected by all the applications.
