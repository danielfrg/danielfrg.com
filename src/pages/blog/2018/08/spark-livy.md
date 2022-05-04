---
title: Spark & Livy together in hell (kerberos)
layout: ../../../../layouts/BlogPost.astro
slug: spark-livy
publishDate: 2018-09-02T17:12:00Z
tags: ["Spark", "Livy", "Hadoop", "Kerberos", "Python", "Spark magic"]
author: Daniel Rodriguez
---

Notes on getting Livy configured with Kerberos in CDH. Oh yeah and use it in Python via Sparkmagic.

## Install Livy

Create a Livy user to run the livy server

```plain
sudo useradd -m -p $(echo livy | openssl passwd -1 -stdin) livy
```

Download Livy (0.5-incubating) at the time of writing this and unzip/untar it in the Livy user home dir.

## HDFS for Livy

Create HDFS directory for Livy

```plain
kinit hdfs # password: hdfs in this doc

hdfs dfs -mkdir -p /user/livy
hdfs dfs -chown -R livy:livy /user/livy
```

### Kerberos principals and keytabs

We need to generate one kerberos principals for Livy and two keytabs for Livy and the webserver.

This has to be done in the KDC server.

You have to change the hostname to the node that is running.

In my tests I used password livy for both principals.

```plain
$ sudo kadmin.local

kadmin.local:  addprinc -randkey livy/$HOSTNAME
WARNING: no policy specified for livy/$HOSTNAME@ANACONDA.COM; defaulting to no policy
Enter password for principal "livy/$HOSTNAME@ANACONDA.COM":
Re-enter password for principal "livy/$HOSTNAME@ANACONDA.COM":
kadmin.local:  xst -norandkey -k livy.keytab livy/$HOSTNAME@ANACONDA.COM
...

kadmin.local:  xst -norandkey -k httplivy.keytab livy/$HOSTNAME@ANACONDA.COM HTTP/$HOSTNAME@ANACONDA.COM
...
```

**Important notes:**
- The HTTP principal must be in the format `HTTP/fully.qualified.domain.name@YOUR-REALM.COM`. The first component of the principal must be the literal string `HTTP`. This format is standard for HTTP principals in SPNEGO and is hard-coded in Hadoop. It cannot be deviated from.
- Make sure that those two keytabs are readable by the user executing the livy-server

```plain
sudo chown livy:livy -.keytab
sudo chmod 644 -.keytab
sudo mv -.keytab /etc/security
```

## Configure Livy

- Populate the  `conf/livy.conf` (note the hostnames will be different):

```plain
livy.server.port = 8998

# Auth
livy.server.auth.type = kerberos
livy.impersonation.enabled = false  # see notes below

# Principals and keytabs to exactly match those generated before
livy.server.launch.kerberos.principal = livy/$HOSTNAME@ANACONDA.COM
livy.server.launch.kerberos.keytab = /etc/security/livy.keytab
livy.server.auth.kerberos.principal = HTTP/ip-172-31-3-131@ANACONDA.COM
livy.server.auth.kerberos.keytab = /etc/security/httplivy.keytab

# This may not be required when delegating auth to kerberos
livy.server.access_control.enabled = true
livy.server.access_control.users = livy,hdfs,zeppelin
livy.superusers = livy,hdfs,zeppelin

# What spark master Livy sessions should use: yarn or yarn-cluster
livy.spark.master = yarn

# What spark deploy mode Livy sessions should use: client or cluster
livy.spark.deployMode = cluster
```

- Set  this variables in `/conf/livy-env.sh`:

```plain
export JAVA_HOME=/usr/java/jdk1.8.0_121-cloudera/jre/
export SPARK_HOME=/opt/cloudera/parcels/CDH/lib/spark/
export SPARK_CONF_DIR=$SPARK_HOME/conf/
export HADOOP_HOME=/etc/hadoop/
export HADOOP_CONF_DIR=$HADOOP_HOME/conf
```

- Set `log4j.rootCategory=DEBUG, console` in `/conf/log4j.properties`

- Start livy-server, you should see something like:

```plain
$ ./bin/livy-server
...
KerberosAuthenticationHandler: Login using keytab ./http-livy-ip-172-31-0-40.ec2.internal.keytab, for principal http-livy/ip-172-31-0-40.ec2.internal@ANACONDA.COM
Debug is  true storeKey true useTicketCache true useKeyTab true doNotPrompt true ticketCache is null isInitiator false KeyTab is ./http-livy-ip-172-31-0-40.ec2.internal.keytab refreshKrb5Config is true principal is http-livy/ip-172-31-0-40.ec2.internal@ANACONDA.COM tryFirstPass is false useFirstPass is false storePass is false clearPass is false
Refreshing Kerberos configuration
Acquire TGT from Cache
Principal is http-livy/ip-172-31-0-40.ec2.internal@ANACONDA.COM
null credentials from Ticket Cache
principal is http-livy/ip-172-31-0-40.ec2.internal@ANACONDA.COM
Will use keytab
Commit Succeeded
```

## Impersonation

If impersonation is not enabled, the user executing the livy-server (usually livy) must exist on every machine. So you have do do (in all the nodes):

```plain
sudo useradd -m livy
```

If impersonation is enabled, any user executing a spark session must be able to exists in on every machine. This is usually handled by AD (?)

You also need to enable some settings in the `core-site.xml`:

- In Cloudera Manager go to the `HDFS configuration`, search for `Cluster-wide Advanced Configuration Snippet` for `core-site.xml` and add two new options for:

```plain
<property>
<name>hadoop.proxyuser.livy.hosts</name>
  <value>-</value>
</property>
<property>
  <name>hadoop.proxyuser.livy.groups</name>
  <value>-</value>
</property>

```

In this case livy is the user that is allowed to impersonate users, so in this case I need to run livy the livy-server.

## HDFS for users

You might need to create an HDFS home directory for the users that are going to be impersonated. To do that kinit as `hdfs@ANACONDA.COM`:

```plain
$ kinit hdfs@ANACONDA.COM  # password `hdfs` in this document

$ hdfs dfs -mkdir /user/centos
$ hdfs dfs -chown centos:centos /user/centos

```

## Connecting to Livy

Now you can kinit and connect to Livy for example using sparkmagic with a  `~/.sparkmagic/config.json` like:

```plain
{
"kernel_python_credentials" : {
	"username": "",
	"password": "",
	"url": "http://{{ livy_server }}:8998",
	"auth": "Kerberos"
  }
}
```

If you don’t kinit sparkmagic will show an error like: Authentication required

### Livy + REST example

This is a nice way to test faster than starting jupyter notebook

```python
import requests

import kerberos
import requests_kerberos
import json, pprint, textwrap

host = 'http://ip-172-31-60-124.ec2.internal:8998'
auth = requests_kerberos.HTTPKerberosAuth(mutual_authentication=requests_kerberos.REQUIRED, force_preemptive=True)

data = {'kind': 'pyspark'}
headers = {'Content-Type': 'application/json'}

r = requests.post(host + '/sessions', data=json.dumps(data), headers=headers, auth=auth)
session_url = host + r.headers['location']

data = {'code': '1 + 1'}

data = {
  'code': textwrap.dedent("""
	import random
	NUM_SAMPLES = 100000
	def sample(p):
	  x, y = random.random(), random.random()
	  return 1 if x-x + y-y < 1 else 0

	count = sc.parallelize(xrange(0, NUM_SAMPLES)).map(sample).reduce(lambda a, b: a + b)
	print "Pi is roughly %f" % (4.0 - count / NUM_SAMPLES)
	""")
}

data = {
  'code': textwrap.dedent("""
	import sys
	rdd = sc.parallelize(range(100), 10)
	print(rdd.collect())
	""")
}
statements_url = session_url + '/statements'

r = requests.post(statements_url, data=json.dumps(data), headers=headers, auth=auth)
pprint.pprint(r.json())

r = requests.get(statements_url, headers=headers, auth=auth)
r.json()

r = requests.delete(session_url, headers=headers, auth=auth)
```

## More stuff

Livy, Spark and Hive: When Spark only shows the default table when querying a Hive table, remember to place the `hive-site.xml` in the livy conf directory.

## Based on
1. [https://henning.kropponline.de/2016/11/06/connecting-livy-to-a-secured-kerberized-hdp-cluster/](https://henning.kropponline.de/2016/11/06/connecting-livy-to-a-secured-kerberized-hdp-cluster/)
