---
title: Hadoop and Kerberos a love story
slug: hadoop-kerberos
date: 2018-09-01T17:12:00Z
tags: ["Hadoop", "Kerberos"]
author: Daniel Rodriguez
---

For CentOS

### KDC Server

Install:
	yum install -y openldap-clients krb5-server krb5-workstation krb5-libs

There is 3 files that are important:

**/etc/krb5.conf**

This will setup an `ANACONDA.COM` realm pointing to `$KERBEROS_ADMIN_SERVER`

	# Configuration snippets may be placed in this directory as well
	includedir /etc/krb5.conf.d/
	[logging]
	 default = FILE:/var/log/krb5libs.log
	 kdc = FILE:/var/log/krb5kdc.log
	 admin_server = FILE:/var/log/kadmind.log
	[libdefaults]
	 dns_lookup_realm = false
	 ticket_lifetime = 24h
	 renew_lifetime = 7d
	 forwardable = true
	 rdns = false
	 default_realm = ANACONDA.COM
	 default_ccache_name = KEYRING:persistent:%{uid}
	[realms]
	 ANACONDA.COM = {
	  kdc = $KERBEROS_ADMIN_SERVER
	  admin_server = $KERBEROS_ADMIN_SERVER
	 }
	[domain_realm]
	 .ANACONDA.COM = ANACONDA.COM
	 ANACONDA.COM = ANACONDA.COM

**/var/kerberos/krb5kdc/kdc.conf**

This just have some settings to make it compatible with MIT KDC, if using AD might need something different.

	[kdcdefaults]
	 kdc_ports = 88
	 kdc_tcp_ports = 88
	 max_life = 1d
	 max_renewable_life = 7d
	[realms]
	 ANACONDA.COM = {
	  max_renewable_life = 7d 0h 0m 0s
	  acl_file = /var/kerberos/krb5kdc/kadm5.acl
	  dict_file = /usr/share/dict/words
	  admin_keytab = /var/kerberos/krb5kdc/kadm5.keytab
	  # note that aes256 is ONLY supported in Active Directory in a domain / forrest operating at a 2008 or greater functional level.
	  # aes256 requires that you download and deploy the JCE Policy files for your JDK release level to provide
	  # strong java encryption extension levels like AES256. Make sure to match based on the encryption configured within AD for
	  # cross realm auth, note that RC4 = arcfour when comparing windows and linux enctypes
	  supported_enctypes = aes256-cts:normal aes128-cts:normal arcfour-hmac:normal
	  default_principal_flags = +renewable, +forwardable


**/var/kerberos/krb5kdc/kadm5.acl**

This just allows anyone under `*/admin@ANACONDA.COM` for example `daniel/admin@ANACONDA.COM` to do anything

	*/admin@ANACONDA.COM	*

**Create kerberos DB**

This will create the database with password anaconda

	sudo kdb5_util -P anaconda create -s

**Start services**

	sudo service krb5kdc start
	sudo service kadmin start

**Create principals**

We will use this to test and allow cloudera to do more stuff later

	sudo kadmin.local addprinc -pw centos centos@ANACONDA.COM
	sudo kadmin.local addprinc -pw cloudera cloudera-scm/admin@ANACONDA.COM

### Other Nodes

Other nodes will just connect to the kerberos admin server so just repeat the install and files sections on the server, don’t create database or start services.

Then you can just:

	kinit  # Here use the password of the centos user: `centos`
	klist
	# Should allow you

	kdestroy
	klist
	# Should fail since you logged out


## Cloudera Manager

This is relatively straightforward just following the wizard under Administration \> Security \> Enable Kerberos

Some needed values are:

- The hostname of the kerberos server (on EC2 use the private DNS name)
- Realm: `ANACONDA.COM`
- Allow: Manage `krb5.conf` through Cloudera Manager
- Principal `cloudera-scm/admin@ANACONDA.COM` and its password `cloudera-scm`

**Check**

Once thats done you can no longer do:

	sudo su - hdfs
	hadoop fs -ls /

This should throw an error. Victory!

## Giving users access

Now that unauthenticated users cannot use the services we need create a way for users to do it.

Create a principal, e.g. for the centos user with password centos:

	sudo kadmin.local addprinc -pw centos centos@ANACONDA.COM

	# Also create one for the hdfs superuser
	sudo kadmin.local addprinc -pw hdfs hdfs@ANACONDA.COM


Now the centos user can kinit with his password and use hdfs or hive or impala-shell:

	$ kinit

	Password for centos@ANACONDA.COM:
	$ hdfs dfs -ls /
	Found 2 items
	drwxrwxrwt   - hdfs supergroup          0 2018-01-26 07:27 /tmp
	drwxr-xr-x   - hdfs supergroup          0 2018-01-26 15:20 /user

	$ hive
	hive> show databases;
	OK
	default
	Time taken: 1.699 seconds, Fetched: 1 row(s)

	$ impala-shell
	Kerberos ticket found in the credentials cache, retrying the connection with a secure transport.
	Connected to ...
	> show databases;
	Query: show databases
	+******************+**********************************************+
	| name             | comment                                      |
	+******************+**********************************************+
	| _impala_builtins | System database for Impala builtin functions |
	| default          | Default Hive database                        |
	+******************+**********************************************+
	Fetched 2 row(s) in 0.14s


Notes:

-  This depends on the node you run this commands, for example the impala-daemon might not be in all the nodes and cannot use it if the node is not tagged in CDH with the correct role
- After doing `impala-shell` some new TGT tickets (or something) get added to the session and might break access to the other services, if thats the case need to kdestroy and kinit again

**Creating a keytab**

To get access without password we can create a keytab for the users, for example centos.

	$ ktutil
	ktutil:  add_entry -password -p centos@ANACONDA.COM -k 1 -e rc4-hmac
	Password for centos@ANACONDA.COM:  # centos in this doc
	ktutil:  wkt centos.keytab
	ktutil:  clear


Now we have a `centos.keytab` that we can use to kinit:

	$ kinit centos -kt centos.keytab
	$ klist
	Ticket cache: FILE:/tmp/krb5cc_1000
	Default principal: centos@ANACONDA.COM
	Valid starting     Expires            Service principal
	26/01/18 15:49:23  27/01/18 15:49:23  krbtgt/ANACONDA.COM@ANACONDA.COM
			renew until 02/02/18 15:49:23

	$ hadoop fs -ls /
	Found 2 items
	drwxrwxrwt   - hdfs supergroup          0 2018-01-26 07:27 /tmp
	drwxr-xr-x   - hdfs supergroup          0 2018-01-26 15:20 /user

**Notes:**

To check the principals:

	sudo kadmin.local list_principals

**Based on**

1. [https://blog.cloudera.com/blog/2015/03/how-to-quickly-configure-kerberos-for-your-apache-hadoop-cluster/](https://blog.cloudera.com/blog/2015/03/how-to-quickly-configure-kerberos-for-your-apache-hadoop-cluster/)
2. [https://www.cloudera.com/documentation/enterprise/5-6-x/topics/cm_sg_sec_troubleshooting.html](https://www.cloudera.com/documentation/enterprise/5-6-x/topics/cm_sg_sec_troubleshooting.html)
3. [https://www.cloudera.com/documentation/enterprise/5-8-x/topics/cm_sg_s3_cm_principal.html](https://www.cloudera.com/documentation/enterprise/5-8-x/topics/cm_sg_s3_cm_principal.html)
