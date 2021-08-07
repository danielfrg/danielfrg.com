---
title: "Notes for: TGIK 002: Networking and Services"
slug: tgik-002-networking-services
date: 2018-07-14T12:02:00Z
tags: ["Tech notes", "Kubernetes", "Networking"]
author: Daniel Rodriguez
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/PlnvxqKR28A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Create a deployment:

```plain
kubectl run --image=gcr.io/kuar-demo/kuard-amd64:1 kuard
kubectl port-forward kuard-XXXX-XXXX 8080:8080
```

We can get into that pod using (basically ssh'ing into the container):

```plain
kubectl exec -it kuard-XXXXX-XXXXX ash
```

Inside the container we can for example execute `ifconfig` and it will tell use the IP address e.g. `inet addr:192.168.89.66` . Every single pod in k8s get a different IP address different than the node they are running on, we can see them both of them with `kubectl get pods -o wide`:

```plain
NAME  READY  STATUS   RESTARTS  AGE  IP             NODE
XXX.  X.     XXXX.    XXXX.     X.   192.168.89.66  ip-10-0-25-2...
```

This is very different than other systems like Borg and Mesos. These systems allocated ports for applications but they were non deterministic, which can be problematic for some application, can be solved with ENV VARS but it was non ideal and compatible with other workloads that are out there and people ended up having plumbing for handling this stuff. Kubernetes is doing that plumbing instead of pushing it to the users.

Getting this running in one way its not "that hard" but doing it in a way that is pluggable is another story, this is what k8s and CNI and other projects do.

Kubernetes gives each pod its own IP address and two different pods that are running in different machines to be able to talk to each other directly with that IP address. It is also be possible to talk from a pod to a k8s host and from a host to a pod.

- Pod to Pod: Back inside one of the containers we can ip another IP address of another pod and `wget <pod IP addr>:<port>`
- Host to Pod: This one is also very simple we just need to go (ssh) into a k8s node and `curl <pod IP addr>:<port>`
- Pod to Host: In the host we can run `python -m SimpleHTTPServer 8000` we go inside one of the pods and we can just `curl <host IP addr>:8000>`
- Intra-network communication. Not the default.
	- You can reach out from the cluster to other nodes not running in the cluster. From any Pod you can talk to any machine on the network and it will work just fine, any request gets NATed out and goes to a machine not in the cluster and it gets NATed in.
	- Most k8s setups don't allow to do the other way around (go from a node outside the cluster to a Pod IP directly), you need a service or Istio or something else to do this. To solve this you can use AWS routing or install the network components in other nodes outside the cluster so they can join the network of the cluster without being part of it and get connectivity that way.
	- This is useful for some more advance service discovery. You application is talking to a service, that service is implemented by this 10 IP addresses that are pods and the app can be smart about that.

CNI (Container Networking System): I have a bunch of containers, i wanna configure networking how can I make that standard interfaces.

- Came up from k8s but the abstraction is being used in other contexts
- On the host look at `/etc/cni/net.d`, look at the files there for config Also `/opt/cni` for the actual plugin binaries that run the CNI protocol
- Everytime there is an operation that needs to happen in the container it calls out to the plugin. You can have multiple plugins for multiple interfaces for the container
- IPAM: IP-Address-Management: How do I allocate who has which IP where and when?
- CNI takes all the network setup away from docker, does it first and run the docker container inside that pre-created network namespace
- Takes what docker does and explodes it into a pluggable system

Ideal number of containers per pod? As few as you can get away with. Run more containers in a pod if they are really symbiotic (work together in a really great way). Anti-pattern: Frontend and DB in a Pod; this things can talk over the network you should make them to that. Think if two things really have to be collocated on the same host. One container per pod is very usual but is also common for pods to run sidecar containers (Istio).

## Exposing a service

We can expose this pods using a `Service`:

```plain
kubectl expose deploy kuard --type=LoadBalancer --port=80 --target-port=8080
```

This is saying: Create a new Service object and point that Service obj **to the same set of pods** that are being deployed by the deployment. Note that the Service **is not** pointing to the deployment its pointing to the Pods. Deployments and Services don't know about each other they coordinate by using labels on Pods.

There is 4 types of Services with different behavior based on the types. ClusterIP, NodePort, LoadBalancer, ExternalName.

K8s collects all the information of the endpoints of a Service into another API: `kubectl get endpoints kuard -o yaml`. This returns all the endpoints (Pod IP address) that are part of this.

This is the service discovery mechanism: I have a name (`kuard`) decode that into a bunch of IP addresses for me.

Port and Protocol are common across the IP addresses.

If the pods have health checks, then the endpoints API will check those to see if they should be listed (healthy) or not (sick).

## None

Even if its not listed you can also do this type

What this means is: Create a Service object (so I have a selector) and thats it; I want to give a name to a labeled query.

## ClusterIP

The Service get assigned an IP address. This is a virtual IP. The range for this IP addresses is a different range from the Pod IP address range. For the life of the Service, this IP address will not change.

In all the nodes there is a `kube-proxy` service and it's what makes this magic IP work. The `kube-proxy` can be (doesn't have to) run as a DaemonSet to make it run in every node. This monitors the Services to find all the ClusterIPs, goes and looks at the pairing endpoint of the service, looks for any changes of those, and finally configures iptables (on the host) such that any traffic going to one of those ClusterIPs gets randomly load balanced using iptables across all the endpoints.

If we `iptables -L` we can see a bunch of rules with comments like `/* cali:XXXXXXX */`, all of those are managed by calico (or the network plugin). If we look for out service name `kuard` we can find that there is something like:

```plain
-A KUBE-SERVICES -d <ClusterIP> .... -j KUBE-SVC-XYZ
...
-A KUBE-SVC-XYZ ... --probability 0.1 -j KUBE-SEP-ABC
... same thing times the number of replicas
...
-A KUBE-SEP-ABC -p tcp ... -j DNAT --to-destination 192.168.89.65:8080
... same thing times the number of replicas
```

So this is saying, if something is going to the `<ClusterIP>` send it to the chain `KUBE-SVC-XYZ`, this chain is going to the same size of the number of replicas and they are going to have some probabilities to land in one of the iptables entries that end up doing a DNAT to one of the Pod IPs that is backing it up.

This is the magic that the kube-proxy creates based on the Service and Endpoints. Create a Virtual IP that represents the service.

Why not give DNS names to Pods? because Pods change really fast and since Pod change IP address every time they start is not a good idea. Services maintain the ClusterIP for their lifetime.

The full DNS name is: `<service>.<namespace>.svc.cluster.local`  e.g. `kuard.default.svc.cluster.local`. This DNS is another extension built on top of  k8s that watches the Services and Endpoints and creates a DNS filter service.

This works great for stuff on cluster how to you handle stuff that is off the cluster? NodePort!

## NodePort

This type of Service is a way to reach from outside the cluster to inside the cluster.

Anybody that talks to any node in the cluster on this NodePort ends up talking to that Service.

This also works with some iptables magic, similar to the VIP of ClusterIP.

## LoadBalancer

This requires an appropriate cluster plugins, for example AWS ELB.

K8s goes out and creates an ELB that points to all the nodes at the NodePort

Path: User -\> ELB -\> Random Node -\> Pod (that might be running in a diff node). So there might be some extra hopping until you find the correct host that is running the Pod. This is being worked one by using health checks on the ELB so it only sends it to a node that is running the Pod.

### ExternalName

I want to use k8s service discovery but I want to point it to something that is running outside the cluster.

You can specify a DNS address and k8s becomes (kinda) a mirror of that DNS address.

Its a good way to connect from inside of k8s to outside of k8s.

## Links

- Repo: [https://github.com/heptio/tgik/tree/master/episodes/002](https://github.com/heptio/tgik/tree/master/episodes/002)
