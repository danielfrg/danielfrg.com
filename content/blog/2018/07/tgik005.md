---
title: "Notes for: TGIK 005: Pod Params and Probes"
slug: tgik-005-pods-params-probes
date: 2018-07-15T14:00:00Z
tags: ["Tech notes", "Kubernetes", "Pods", "Deployments", "Probes"]
author: Daniel Rodriguez
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/xEdBSVaUtp4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Pods, ReplicaSets and Deployments

`kubectl run` is a nice tool to launch pods, deployments and other objects based on some hardcoded generators. Lets launch a Pod:

```plain
kubectl run kuard --generator=run-pod/v1 --image=gcr.io/kuar-demo/kuard-amd64:1
```

We can get the full k8s object yaml that the system is using and do things more declaratively things is using:

```plain
kubectl get pods kuard -o yaml

# Some interesting things:
	resourceVersion: "15084"
```

If we try to `kubectl apply` this yaml it wont work because of that version number. We can add an `--export` flag to get a yaml that is more friendly and that we can actually change. We still need to remove some things like the `nodeName`.

Another much better options is to use the generator and add `-o yaml --dry-run`:

```plain
kubectl run kuard --generator=run-pod/v1 --image=gcr.io/kuar-demo/kuard-amd64:1 -o yaml --dry-run
```

This will return a super clean yaml that is sent to the system.

**Tip:** we can use `-w` to watch the output e.g:

```plain
kubectl get pod kuard -w -o wide
```

Joe goes through a nice demo of killing the docker container directly and the Pod dying and getting restarted since it has `restartPolicy: Always`. Then he terminates a k8s node where the Pod is running and this time the Pod is actually gone because **once a Pod gets assigned to a Node stays on that Node**.

The reason for this is that in distributed systems when something (a node) fails you don't know for how long is it going to be down, it could be 30 secs or 30 days. If a node fails and Pods gets rescheduled in another node but then node comes back with the same Pod running things can get weird for other systems that do tracing and logging. The real answer for this problem is a ReplicaSet.

When we wrap a Pod spec into a ReplicaSet, so the Pods is managed by the ReplicaSet, it will launch a Pod with a name like `<name>-<uuid>`.

If we kill (again) the Node where a Pod is running the ReplicaSet is going to notice it should be running 1 Pod but it has 0, so it will start a new one. Kubernetes doesn't really *reschedule* Pods, what it really does is recreate them with a different name (`<name>-<uuid>`). So if the Node comes back the original Pod will be running (with its original name) which is "fine" and the ReplicaSet will decide what to do with that Pod.

Deployments are ReplicaSets + roll-upgrades and rollback-downgrades.

`kubectl create` vs `kubectl apply`: apply is create but if already exists will update it. There is other magic with apply in terms of Horizontal Auto Scaling and other edge cases that apply helps with.

Deplyments create ReplicaSets and ReplicaSets create Pods. If you do:

```plain
$ kubectl get pods
kuard-XXXXXXXX-YYYY ...
```

- `kuard` is the name of the deployment
- `kuard-XXXXXXXX` is the name of the ReplicaSet
- `XXXXXXXX` is a hash of the description of the ReplicaSet

## Probes

There is two types of Probes for Containers. Each Container of a Pod can have its own Probes.

1. Liveness: Is the thing up and running and at all functional or its the service not working correctly. Its used to detect if the program its in a messed up situation.
2. Readiness: Is the thing ready to receive traffic. Doing some initialization.

There is also multiple types for each Probe: HTTP or a command that gets executed into the container (maybe reads a file).

There is parameters like how often to check the endpoint and how long to wait for the initial query, how many times should it see fail in a row to actually declare it dead and others, see docs.

One thing to note is that if the liveness Probe is executed by the local kubelet, so when it notices that it failed will locally restart the Pod so its very fast. The Pods also maintains the name.

**Tip**: You don't want the Probe to check stuff outside your server. Something else might be sick and you don't want to report it, that service should report it.

Why not just rely on the docker container just dying? The thing is that when services fail they just don't crash, most of the times they are still running but in a zombie state. The liveness Probe help to discover this.

When a Liveness Probe fails that particular Pod gets removed from the Endpoints list so a Service does not send traffic to that Pod.

## Links

- [k8s probes docs](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
