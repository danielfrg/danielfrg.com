---
title: Jupyter Hub on Kubernetes with LDAP
slug: jupyterhub-ldap
pubDate: 2016-09-03
tags: ["Kubernetes", "Jupyter Hub", "Docker", "LDAP"]
---

In this post I am going to show some initial work I did in the last day to deploy
Jupyter Hub in Kubernetes with user auth based on LDAP.

I wasn't that much work considering that Jupyter Hub already had support for LDAP user auth and
the modularity they have is amazing. It was quite straight forward to write a new spawner
based on the existing one on the [Jupyter Hub github org](https://github.com/jupyterhub/jupyterhub).

All the code in this post is at
[danielfrg/jupyterhub-kubernetes_spawner](https://github.com/danielfrg/jupyterhub-kubernetes_spawner).
Specifically in the `examples` directory.

I consider this a nice example of a more production ready Jupyter Hub deployment being based on LDAP
that for good or bad is everywhere and Kubernetes to deployment of the single user notebook servers.

Something I don't talk is SSL certificates because its very well supported on Jupyter Hub and
I think there is enough information about them on the Jupyter Hub docs and online.
And yes, I was lazy to do it :)

## Requirements

Basically the only requirement to get this running is a Kubernetes cluster (credentials) and time.

By far the best way to get a Kubernetes cluster is to use the
[Google Container Engine](https://cloud.google.com/container-engine/) to create one.

From this point I am assuming you have one.

## LDAP

LDAP will be the user directory that we are going to use authenticate in Jupyter Hub.
Just as an example we are going to deploy `openlpad` and `phpldapadmin` as an UI also in the
same Kubernetes cluster.

In the example directory I provide an `ldap.yml` file that has a simple kubernetes deployment
object and one service to expose the `phpldapadmin` UI.

The deployment consist of only one Pod with two containers.

First container is `openldap`:

```yaml
containers:
  - name: openldap
    image: osixia/openldap
    ports:
      - containerPort: 389
      - containerPort: 636
```

Second container is `phpldapadmin`, disabling HTTPS (so port 80) and the LDAP host being `localhost` since
its the same Pod:

```yaml
- name: phpldapadmin
  image: osixia/phpldapadmin
  ports:
    - containerPort: 80
  env:
    - name: PHPLDAPADMIN_HTTPS
      value: "false"
    - name: PHPLDAPADMIN_LDAP_HOSTS
      value: localhost
```

Finaly one simple Kubernetes service to expose the `phpldapadmin` UI:

```yaml
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: jupyterhub-ldap
```

To deploy everything just need to run:

```shell
$ kubectl create -f ldap.yml
deployment "jupyterhub-ldap" created
service "jupyterhub-ldap-admin" created
```

After that just wait for the Pod to be ready and the service to give you a public IP:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
jupyterhub-ldap    1         1         1            1           25s

$ kubectl get service
NAME                     CLUSTER-IP       EXTERNAL-IP       PORT(S)     AGE
jupyterhub-ldap-admin    10.103.241.31    104.154.70.197    80/TCP      56s
```

Now you can go to the External IP (`104.154.70.197` in my case) and see the `phpldapadmin` UI.

The default user is `admin` with `dc=example` and `dc=org` (in LDAP lang that means
DN=`cn=admin,dc=example,dc=org` in the user field) with password of `admin`.

Just as an example and to see how the auth works later lest create a couple of users.

First we need a `Posix Group` to place the users I chose: `jupyterhub`.
Under that group create a couple of `Generic: User Account` the result should look something like this:

![](/blog/2016/09/jupyterhub-ldap/phpldapadmin.png)

Thats all the work we need to do in the LDAP front.

## Jupyter Hub

Jupyter Hub basically consists of two parts the
[configurable-http-proxy](https://github.com/jupyterhub/configurable-http-proxy)
which is a small magic utility and the actual [Jupyter Hub](https://github.com/jupyterhub/jupyterhub).

When you start the Jupyter Hub it will start the `configurable-http-proxy` but
I prefer to have each component in its own container like I show in the last deployment.

Before actually deploying the Jupyter Hub
we need to create a Docker image that has the Jupyter Hub plugins for ldap and my Kubernetes spawner.
We do this by extending the official `jupyterhub/jupyterhub` image:

```docker
FROM jupyterhub/jupyterhub

RUN apt-get update && apt-get install -y curl
RUN pip install jupyterhub-ldapauthenticator
RUN pip install git+git://github.com/danielfrg/jupyterhub-kubernetes_spawner.git

COPY jupyterhub_config.py /srv/jupyterhub/jupyterhub_config.py
COPY start.sh /srv/jupyterhub/start.sh
RUN chmod +x /srv/jupyterhub/start.sh

CMD ["/srv/jupyterhub/start.sh"]
```

The only think that is missing is fill the `jupyterhub_config.py` file with the missing values:
Kubernetes auth and LDAP server location.

```python
c.JupyterHub.authenticator_class = 'ldapauthenticator.LDAPAuthenticator'
c.LDAPAuthenticator.bind_dn_template = 'cn={username},cn=jupyterhub,dc=example,dc=org'
c.LDAPAuthenticator.server_address = '{ LDAP_POD_ID }'
c.LDAPAuthenticator.use_ssl = False

c.JupyterHub.spawner_class = 'kubernetes_spawner.KubernetesSpawner'
c.KubernetesSpawner.host = '{ KUBE_HOST }'
c.KubernetesSpawner.username = '{ KUBE_USER }'
c.KubernetesSpawner.password = '{ KUBE_PASS }'
c.KubernetesSpawner.verify_ssl = False
c.KubernetesSpawner.hub_ip_from_service = "jupyterhub"
```

The missing values are:

- `LDAP_POD_ID`: Get this one from the Pod we created in the LDAP section:

```shell
$ kubectl get Pods
NAME                               READY     STATUS    RESTARTS   AGE
jupyterhub-ldap-2860785391-pjiq7   2/2       Running   0          31m

$ kubectl describe Pod jupyterhub-ldap-2860785391-pjiq7 | grep ip
IP:    		10.100.5.3
```

My value is `10.100.5.3`.

- Note `cn={username},cn=jupyterhub,dc=example,dc=org` has to match the structure created for the LDAP user entries.
- `KUBE_HOST`, `KUBE_USER`, `KUBEPASS`. Get those from `kubectl config view`

Now we need to create the image:

```shell
$ docker build -t gcr.io/continuum-compute/jupyterhub-kube:0.2 .
...

$ gcloud docker push gcr.io/continuum-compute/jupyterhub-kube:0.2
...
```

Notice the tag of the container is `gcr.io/continuum-compute/jupyterhub-kube:0.2` because
I upload the image to the Google Container Registry but it could be a container on Docker Hub.

Thats it! Now we can deploy this image using the `hub.yml` deployment file.

This deployment consists of one Pod with two containers.

First one is the `configurable-http-proxy`:

```yaml
containers:
  - name: proxy
    image: jupyterhub/configurable-http-proxy
    ports:
      - containerPort: 8000
      - containerPort: 8001
    command:
      - configurable-http-proxy
      - --ip
      - 0.0.0.0
      - --api-ip
      - 0.0.0.0
      - --default-target
      - http://127.0.0.1:8081
      - --error-target
      - http://127.0.0.1:8081/hub/error
```

Second one is the actual Jupyter Hub server. Notice I use the image I created and uploaded before:

```yaml
- name: jupyterhub
  image: gcr.io/continuum-compute/jupyterhub-kube:0.2
  ports:
    - containerPort: 8081
```

Then two services to expose the APIs to the public

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jupyterhub
  labels:
    app: jupyterhub
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8000
  selector:
    app: jupyterhub
---
apiVersion: v1
kind: Service
metadata:
  name: jupyterhub-api
  labels:
    app: jupyterhub-api
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8001
  selector:
    app: jupyterhub
```

Use the file to create the deployment and wait for the Public IPs to be assigned:

```shell
$ kubectl create -f hub.yml
deployment "jupyterhub" created
service "jupyterhub" created
service "jupyterhub-api" created

$ sleep 20

$ kubectl get service
NAME                     CLUSTER-IP       EXTERNAL-IP       PORT(S)     AGE
jupyterhub               10.103.254.164   130.211.158.251   80/TCP      2m
jupyterhub-api           10.103.248.253   130.211.117.81    80/TCP      2m
jupyterhub-ldap-admin    10.103.241.31    104.154.70.197    80/TCP      43m
```

In your browser go to the external IP of the jupyterhub service in my case: `130.211.158.251` and
you should see the Jupyter Hub UI. Now you should be able to log in using any of the user entries
in LDAP.

![](/blog/2016/09/jupyterhub-ldap/hub-login.png)

Note that it could take a minute to start the actual notebook server since the image
that is pulled for the notebook is quite big but once the image is downloaded
in the kubernetes cluster nodes it starts basically instantly.

As an experiment you can open an incognito window and login as another user.

Now you have two independent containers managed by Kubernetes and Jupyter Hub.

You can take a look at the running Pods now:

```shell
$ kubectl get Pods
jupyterhub-bzaitlen                1/1       Running   0          1m
jupyterhub-danielfrg               1/1       Running   0          7m
...
```

As expected stoping the server in the Jupyter Hub UI will stop the Pod.

## Future

There is more work to be done the main issue is that even when Jupyter Hub is supposed to be a permanent
place for you notebooks the current setup will create a new container every time and the notebooks will be lost.
The solution to that is to share a persistent volume with the containers.

Also the notebook Pod are not started with any replication control. It would be nice to start them with one
so Kubernetes will restart them if they fail for any reason.

Finally there is some small things that can be done to make the config a little friendlier, for example
the LDAP host can be exposed as a service and user Kubernetes service discovery to find the correct location.
Probably trying to autodetect if the Jupyter Hub is being run in Kubernetes plus some sane defaults is the way to go.
