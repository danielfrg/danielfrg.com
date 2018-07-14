Title: TGIK 004: RBAC
Slug: tgik-004-rbac
Date: 2018-07-14 15:00
Category: video-notes
Tags: Kubernetes,RBAC
Author: Daniel Rodriguez
url: video-notes/tgik-004-rbac
save_as: video-notes/tgik-004-rbac/index.html
video_id: slUMVwRXlRo
Rating: 4/5

How to do Authentication and Authorization for k8s.

The kubeconfig file:

	clusters:
	- cluster:
		certificate-authority-data:
			<This is the root CA that I am going to trust since its a TLS connection to the server>
	    server: <URL>
	  name: <c-name>

With this you could connect (hitting) but you cannot Authenticate to the server, you need:

	users:
	- name: admin
	  user: 
		client-certificate-data: <>
		client-key-data: <>

The `client-key-data` is basically the password.

Then the `context` maps a cluster with a user:

	- context:
		cluster: gke_continuum-compute_us-central1-a_daniel-ml
		user: gke_continuum-compute_us-central1-a_daniel-ml
	  name: gke_continuum-compute_us-central1-a_daniel-ml

> Recommendation: Use a single file per cluster. You can tell kubectl which file to use with KUBECONFIG

## How certificates work

You create one public and one private key. You never share the private key and leave it at one place all the time. To enable trust you make the public key public, saying "I want someone to identify me this way". 

You sign something with a public key and that becomes a CSR (Certificate Signing Request). You hand the CSR to the server, the server says "i know this is you" (via some out of band mechanism) and is able to trust that and stamp and you get a Signed Certificate. 

When you present the Signed Certificate to somebody and if you have the Private Key you can prove that you are who you say you are.

## Authentication
a.k.a Who is this?

The idea of who you are in a k8s cluster is very flexible so it can be integrated with a lot of stuff but it also can be confusing.

The full list of methods to authenticate to k8s can be found here:
[https://kubernetes.io/docs/reference/access-authn-authz/authentication](https://kubernetes.io/docs/reference/access-authn-authz/authentication)

For example for using x509 certificates you can add users by adding k8s CSR like:

	apiVersion: certificates.k8s.io/v1beta1
	kind: CertificateSigningRequest
	metadata:
	  name: user-request-jakub
	spec:
	  groups:
	  - system:authenticated
	  request: <>
	  usages:
	  - digital signature
	  - key encipherment
	  - client auth

And running:

	kubectl create -f ...
	kubectl certificate approve user-request-jakub
	kubectl get csr user-request-jakub -o jsonpath='{.status.certificate}' | base64 -d > jakub.crt

Now we can modify the k8s config file and use the generated key and CSR to login

	kubectl config set-credentials jakub --client-certificate=jakub.crt --client-key=jakub.pem --embed-certs=true

What happens when we try to do something?

	kubectl get pods
	
	> Error from server (Forbidden): User "jakub" cannot list pods in the namespace "default". (get pods)

We can hit the server but we cannot do any action until we create some roles.

## Authorization
a.k.a What can you do?

There is a plugin model in k8s: There is an interface and a couple of implementations and you can change which one to use with some CLI flags.
Docs: [https://kubernetes.io/docs/reference/access-authn-authz/authorization/](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)

Role Base Access Control (RBAC) is the new one.

There is 4 things you have to think about in RBAC:

1. Role and ClusterRole
2. RoleBinding and ClusterRoleBinding

How this work together make more sense when you understand how namespaces work in k8s.

- When we create a k8s object we make a decision on whether this live under a namespace or not. Pods/Service do live under a namespace. Some  (CRS, Nodes) do not  live under a namespace since are cluster wide settings resources are one that are not namespaced.
- Roles are namespaced - ClusterRole are cluster wide resources
- RolesBinding are namespaced - ClusterRoleBinding are cluster wide
- So the actions you can do with Role and ClusterRole are basically the same but one is namespaced and one is not. Same for the RoleBinding types. The question is: Do I want this permission to be in the whole cluster or just in one namespace?

### Role / ClusterRole
	rules:
	- apiGrous:
	    - authorization.k8s.io
	  resources:
	    - selfsubjectaccessreviews
	  verbs:
	    - create

This is saying that we can `create` objects of `authorization.k8s.io/selfsubjectaccessreviews`. The way we identify objects is by apiGroups (`authorization.k8s.io`) that segment the API surface area of k8s and the resource type (`selfsubjectaccessreviews`), you could also narrow it down to an specific resource but its usually not the case.

### RoleBinding / ClusterRoleBinding
This grant permission of an existing role to a group of users.

	roleRef:
	  apiGroup: rabc.authorization.k8s.io
	  kind: ClusterRole
	  name: admin
	subjects:
	- apiGroup: rbac.authorization.k8s.io
	  kind: User
	  name: users:joe

This is saying: Let the `ClusterRole` named `admin` (that has its own permissions) and apply it to the `User` `users:joe`.

## Links

- RBAC cheatsheet: [http://docs.heptio.com/content/tutorials/rbac.html](http://docs.heptio.com/content/tutorials/rbac.html)
- Repo: [https://github.com/heptio/tgik/tree/master/episodes/004](https://github.com/heptio/tgik/tree/master/episodes/004)
