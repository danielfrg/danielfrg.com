Title: Jupyter Hub on Kubernetes Part II: NFS
Slug: jupyterhub-kubernetes-nfs
Date: 2016-09-10
Tags: Jupyter Hub,Kubernetes,LDAP,Docker,NFS
Author: Daniel Rodriguez

Second part of my JupyterHub deployment in Kubernetes experiment be sure to read [Part I]({filename}../jupyterhub-ldap/jupyterhub-ldap.md).

Last time we got JupyterHub authenticating to LDAP and creating the single user notebooks in
Kubernetes containers. As I mentioned in that post one big problem with that deployment
was that the notebook files are gone when the pod is deleted
so this time I add an NFS volume to the JupyterHub single user containers to
persist the notebook data.

Also improved a little bit the deployment and code so to its no longer needed to build a custom image you
can just pull two images from my docker hub registry and configure them using
a [Kubernetes ConfigMap](http://kubernetes.io/docs/user-guide/configmap).

All the code in this post is at
[danielfrg/jupyterhub-kubernetes_spawner](https://github.com/danielfrg/jupyterhub-kubernetes_spawner).
Specifically in the `example` directory.

## NFS

There is multiple options to have [persistent data in Kubernetes containers](http://kubernetes.io/docs/user-guide/persistent-volumes/).
I chose NFS because its one of the few types that allows multiple containers to have read and write access
(ReadWriteMany).
Most of the persistent volume types have read and write access to only one container (ReadWriteOnce)
and/or read only access to multiple containers (ReadOnlyMany).

I wanted to have all JupyterHub single user containers write their notebooks to the same location so its
easier to do backups of the data but since the notebook servers are single user each one of those
containers could use its own disk. On that case backup and maintenance is more complicated.

The following is heavily based on the [Kubernetes NFS documentation](https://github.com/kubernetes/kubernetes/tree/master/examples/volumes/nfs).

In order to mount an NFS volume into the Kubernetes containers we need an NFS server but even before that we
need a Volume that the NFS server can use to store the data.

In GCE we can use a persistent volume claim to ask for a Disk resource:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jupyterhub-storage
  annotations:
    volume.alpha.kubernetes.io/storage-class: any
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 200Gi
```

When you execute this using `kubectl -f file.yaml` GCE will create a new disk that you can see at the GCE
cloud console, something like this:

{% b64img articles/2016/08/jupyterhub-nfs/gce-disk.png "GCE created disk" %}

Now that we have a Disk that the NFS server can use to store its data we create a Deployment of the NFS server
and a service to expose it.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: jupyterhub-nfs
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: jupyterhub-nfs
    spec:
      containers:
      - name: nfs-server
        image: gcr.io/google-samples/nfs-server:1.1
        ports:
          - name: nfs
            containerPort: 2049
          - name: mountd
            containerPort: 20048
          - name: rpcbind
            containerPort: 111
        securityContext:
          privileged: true
        volumeMounts:
          - name: mypvc
            mountPath: /exports
      volumes:
        - name: mypvc
          persistentVolumeClaim:
            claimName: jupyterhub-storage
---
kind: Service
apiVersion: v1
metadata:
  name: jupyterhub-nfs
spec:
  ports:
    - name: nfs
      port: 2049
    - name: mountd
      port: 20048
    - name: rpcbind
      port: 111
  selector:
    app: jupyterhub-nfs
```

All this can be found in the `example/nfs.yml` file when executed there should be a `jupyterhub-nfs` service.

<div class="codehilite">
<pre class="bash">
$ kubectl create -f example/nfs.yml
...

$ kubectl get services
NAME                     CLUSTER-IP       EXTERNAL-IP       PORT(S)                      AGE
jupyterhub-nfs           10.103.253.185   <none>            2049/TCP,20048/TCP,111/TCP   15h
</div>
</pre>

Now with the NFS service ready we need to create a Persistent Volume and another Persistent Volume Claim
for the containers to use.
There is a need for a small manual step here since at the moment its not possible to get a service IP
from a Persistent Volume Object. So open `example/nfs2.yml` and change `{{ X.X.X.X }}` for the `jupyterhub-nfs`
service IP, in this case `10.103.253.185`.

The `nfs2.yml` file also includes a small NGINX deployment with `autoindex on;` to see the files on the
server. Its the base `nginx` image with a ConfigMap to change the default NGNIX conf file.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jupyterhub-nfs-web-config
data:
  default.conf: |-
    server {
        listen   80;
            server_name  localhost;
            root /usr/share/nginx/html;
            location / {
                index none;
                autoindex on;
                autoindex_exact_size off;
                autoindex_localtime on;
        }
    }
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: jupyterhub-nfs-web
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: jupyterhub-nfs-web
    spec:
      containers:
      - name: web
        image: nginx
        ports:
          - containerPort: 80
        volumeMounts:
          - name: nfs
            mountPath: "/usr/share/nginx/html"
          - name: config-volume
            mountPath: "/etc/nginx/conf.d/"
      volumes:
        - name: nfs
          persistentVolumeClaim:
            claimName: jupyterhub-nfs
        - name: config-volume
          configMap:
            name: jupyterhub-nfs-web-config
```

Start the deployment and service and you should see a new `jupyterhub-nfs-web` service

<div class="codehilite">
<pre class="bash">
$ kubectl create -f example/nfs2.yml
...

$ kubectl get services
NAME                     CLUSTER-IP       EXTERNAL-IP       PORT(S)                      AGE
jupyterhub-nfs-web       10.103.241.248   104.197.178.53    80/TCP                       15h
</div>
</pre>

Going to that External IP you should see an empty NGINX file listing.

Thats it! You have a NFS server and the `kubernetes_spawer` will take care of mounting it to the
containers based on some settings.

## JupyterHub

Last time we had the JupyterHub creating containers in Kubernetes now we have the same functionality
but it should be easier to get it running and configured based on a Kubernetes ConfigMap and
two example docker images I uploaded to [my docker registry](https://hub.docker.com/u/danielfrg).

In the last post it was needed to create custom a JupyterHub container images
for each deployment, this image used to havethe `jupyterhub_config.py` file with some values
(credentials and ip addresses).
I changed that deployment to user a Kubernetes ConfigMap that creates the config file so
some base container images can be reused and just need to fill the missing values in the
ConfigMap (`example/hub.yml`).

1. [danielfrg/jupyterhub-kube-ldap](https://hub.docker.com/r/danielfrg/jupyterhub-kube-ldap):
Is based on [jupyterhub/jupyterhub](https://hub.docker.com/r/jupyterhub/jupyterhub) and includes the
[jupyterhub/ldapauthenticator](https://github.com/jupyterhub/ldapauthenticator) and my [jupyterhub-kubernetes_spawner](https://github.com/danielfrg/jupyterhub-kubernetes_spawner)
2. [danielfrg/jupyterhub-kube-ldap-singleuser](https://hub.docker.com/r/danielfrg/jupyterhub-kube-ldap-singleuser/):
Is based on [jupyterhub/singleuser](https://hub.docker.com/r/jupyterhub/singleuser/) and just has different startup script to create the working notebook directory before starting the `jupyterhub-singleuser` server

There is some missing values that need to be filled before starting the deployment
but they are very easy to find.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jupyterhub-config-py
data:
  jupyterhub-config.py: |-
    c.JupyterHub.confirm_no_ssl = True
    c.JupyterHub.db_url = 'sqlite:////tmp/jupyterhub.sqlite'
    c.JupyterHub.cookie_secret_file = '/tmp/jupyterhub_cookie_secret'

    c.JupyterHub.authenticator_class = 'ldapauthenticator.LDAPAuthenticator'
    c.LDAPAuthenticator.bind_dn_template = 'cn={username},cn=jupyterhub,dc=example,dc=org'
    # c.LDAPAuthenticator.server_address = '{{ LDAP_SERVICE_IP }}'
    c.LDAPAuthenticator.use_ssl = False

    c.JupyterHub.spawner_class = 'kubernetes_spawner.KubernetesSpawner'
    # c.KubernetesSpawner.host = '{{ KUBE_HOST }}'
    # c.KubernetesSpawner.username = '{{ KUBE_USER }}'
    # c.KubernetesSpawner.password = '{{ KUBE_PASS }}'
    c.KubernetesSpawner.verify_ssl = False
    c.KubernetesSpawner.hub_ip_from_service = 'jupyterhub'
    c.KubernetesSpawner.container_image = "danielfrg/jupyterhub-kube-ldap-singleuser:0.1"
    c.Spawner.notebook_dir = '/mnt/notebooks/%U'
    c.KubernetesSpawner.persistent_volume_claim_name = 'jupyterhub-nfs'
    c.KubernetesSpawner.persistent_volume_claim_path = '/mnt'
```

Based on the default settings the Kubernetes spawner will user a Kubernetes Persistent Volume Claim and mount
it under `/mnt` then I just have to tell the Spawner what directory under `/mnt` to use for the user notebooks,
for example '/mnt/notebooks/danielfrg'.

Start the JupyterHub service same as before.

<div class="codehilite">
<pre class="bash">
$ kubectl create -f hub.yml
</div>
</pre>

Wait for the service to give you an External IP and login as any LDAP user (see [Part I]({filename}../jupyterhub-ldap/jupyterhub-ldap.md)).

After logging in a new pod will be created and mount the Persistent Volume Claim that uses the NFS Server.
Create a couple of notebooks and in the `jupyterhub-nfs-web` service you should see something like this.

{% b64img articles/2016/08/jupyterhub-nfs/nfs-web.png "NFS web files" %}

Now from the JupyterHub admin interface you should be able to terminate the server and start a new one  
and the notebooks should be persisted even when they will be a different Pod.

## Future

I think that the persisting notebooks was the biggest issue with the previous deployment
that was fixed but there is some security issues.

All the JupyterHub single user containers run using the same user (`root` in this example) and the
whole NFS is mounted to all the containers this means that all the users have access
to all the (other users) notebooks. Even if by default it only shows the user notebooks its
possible to access the files at `/mnt`.


There are some [possible solutions](http://www.tldp.org/HOWTO/NFS-HOWTO/security.html)
in the NFS side but it can also happen in the Kubernetes and Docker side, maybe
with a custom Persistent Volume Claim per user (?). More work is needed here.

The second big (also security) issue right now is how the JupyterHub access the Kubernetes API.
Right now its needed to put the credentials in the ConfigMap and I was planning on
user Kubernetes secrets to make it a little bit more secure but thats not needed.

While I was building this post I found (as I should have expected) that Kubernetes thought about this
issue and that it has the concept of
[Service Accounts](http://kubernetes.io/docs/user-guide/service-accounts/).

With a Service Account its possible to access the Kubernetes API without having to use the User Account
credentials. These Service Account credentials can even be mounted (and are by default) to a container
so it should be very easy to change the code to use them.

This removes the need to have a secondary User Account for the JupyterHub. Thanks Kubernetes!

This is probably the last (big) post about the this experiment but I plan to keep working on
the [kubernetes_spawner](https://github.com/danielfrg/jupyterhub-kubernetes_spawner) to make it better.
At minimum I am for sure going to test and user the Service Account to make the deployment more secure.

<p class="update">
<strong>Update:</strong> I have added support for Kubernetes Service Accounts to the kubernetes_spawner.
So user account credentials are no longer needed.

For updated docs and information take a look at the example folder here:
<a href="https://github.com/danielfrg/jupyterhub-kubernetes_spawner/tree/master/examples/ldap_nfs">examples/ldap_nfs</a>.
</p>
