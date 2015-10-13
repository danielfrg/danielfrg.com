Title: NLP at scale: Semafor + salt + celery and more
Slug: nlp-scale-semafor-salt-celery-more
Date: 2013-11-17
Tags: Python,NLP,Semafor,Salt,Celery,Luigi,Vagrant
Author: Daniel Rodriguez

This posts describes the implementation of a simple system to parse web pages using [SEMAFOR](http://www.ark.cs.cmu.edu/SEMAFOR/) (a SEMantic Analyzer Of Frame Representations) at scale. The system is mainly powered by salt and celery but also uses boto to create worker EC2 instances that parse the documents in parallel and luigi is used to describe the data pipeline in each worker.

The whole source can be found on github: [danielfrg/semafor-parsing](https://github.com/danielfrg/semafor-parsing)

The main idea is the following:

1. We are going to have one master box that has: salt master + celery worker that is going to be waiting for tasks
2. When the master receives a query (list of urls to parse) is going to spin up N number of minions/workers using boto and is going to provision all of them using salt
3. Each minion/worker is going to have SEMAFOR and a celery worker waiting for parsing tasks
4. The master creates a set of parsing tasks based on the number of docs and number of instances
5. Each minion/worker parses the document first using the readability API to get text content from HTML then tokenizing the text into sentences using NLTK and finally parses the sentences using SEMAFOR
6. Each minion/worker uploads the results to S3

The diagram below tries to describe the system.

![System](/images/blog/2013/11/semafor-dist/diagram.png "System description")

If you dont know what semafor is take a look at the [example demo](http://demo.ark.cs.cmu.edu/parse) or this is just a basic example:

Input: <code>There's a Santa Claus!</code>

Output:
```json
{"frames":[{"target":{"name":"Existence","spans":[{"start":0,"end":2,"text":"There 's"}]},"annotationSets":[{"rank":0,"score":52.10168633235354,"frameElements":[{"name":"Entity","spans":[{"start":2,"end":5,"text":"a Santa Claus"}]}]}]}],"tokens":["There","'s","a","Santa","Claus","!"]}
```

The basic idea is: *"Existing"* is related to *"There 's"* and *"Entity"* is related to *"a Santa Claus"*.

## How to run this?

Very simple, only need to get running the master box. Other options are described in the project README but the easiest way is to use vagrant with the AWS provider, just need to run `vagrant up --provider aws` in the master directory, this is going to provision the master box.

When the box is ready just ssh (`vagrant ssh`) and:

1. Edit `~/semafor/master/app/master/settings.py` OR create/edit `~/semafor/master/app/local_settings.py` to look like this.

```python
S3_PATH = 'WHERE THE SEMAFOR FILES WILL BE UPLOADED'
AWS_ACCESS_ID = 'AWS ACCOUNT KEY'
AWS_SECRET_KEY = 'AAWS ACCOUNT SECRET'
READABILITY_TOKEN = 'READABILITY API TOKEN'
SALT_MASTER_PUBLIC_ADDRESS = 'THE IP OF THE MASTER'
LUIGI_CENTRAL_SCHEDULER = 'THE IP OF THE LUIGI SCHEDULER, CAN BE THE SAME SALT MASTER'
```
2. Run celery worker: `cd ~/semafor/app/master/` and `sh start_worker.sh`

Everything is ready now!

Get some URLS you want to parse and call the celery task `semafor_parse(urls, n_instances=1)`. A helper script is provided in `semafor/master/test.py`

## How it looks

This are some screenshots I took while running it:

EC2 dashboard when creating 10 instances

![EC2 instances](/images/blog/2013/11/semafor-dist/instances_ec2.png "EC2 instances")

Log on celery when creating 10 instances

![Instances log](/images/blog/2013/11/semafor-dist/instances_log.png "Instances log")

Celery log when the instances are provisioned via salt and the celery workers are connected
![Celery workers log](/images/blog/2013/11/semafor-dist/celery_workers.png "Celery workers log")

Luigi UI while running
![Luigi UI](/images/blog/2013/11/semafor-dist/luigi_summary.png "Luigi UI")

Luigi dependency graph, really simple for this case.
![Luigi dependency graph](/images/blog/2013/11/semafor-dist/luigi_graph.png "Luigi dependency graph")

## Discussion

I used this opportunity to create a real-life example and keep learning (and loving) salt. At the same time I kept playing with celery and luigi that are 2 libraries that I love mainly because they solve very specific problems and are really easy to use.

The system took me a few nights and a weekend to build but I am very happy to the results, it was **way** easier than I originally though and what makes me even happier is that a few months ago I would consider this a 2/3 month project but I did it in less than a week. Definitely using the right tool for the every step is crucial.

I cannot image to provision the EC2 instances in other way that is not salt, the states are not easy to understand at first but they are really powerful. Also not relying on AMIs was a requirement, they are nice in some cases but **not** for reproducibility. Salt solves this.

Celery makes perfect sense when distributing tasks between different servers, and luigi is perfect for developing the data pipeline in every worker: download text + tokenizing + semafor parsing + upload output. Not to mention that develop the distributed tasks are really easy to develop using celery and the data pipeline is super easy to develop using luigi.

When building this distributed systems using celery I am always thinking: "I should do this on hadoop...” And I love and use hadoop but the reason I did it using other tools is simple: sometimes is just to hard to do it on hadoop... **specially** when one needs to manage different steps, external tools and intermediate files such as the semafor output.

On this particular case one advantage is that semafor is written in Java so it should be "easy" to create some Hadoop job on Java, specially with semafor 3 (currently in alpha) that generates a handy .jar with everything in it. But to be honest I have no idea how to write a hadoop job in Java and I have zero interest in learning. I just want to use hadoop as a service, using pig, hive, MRJob or others. I didn’t want to mess with Java or the semafor source code I just wanted to use it and get the output, and in that case celery + luigi made it easy to develop.

## Improvements to be made

I am always looking for opportunities to improve and try new tools, this are some thing I would love to do.

- An alternative to readability: I love the product, but I would **love** to have the same output offline, I have tried **tons** of boilerplate removal tools, in various languages (python,java,and more) but the best output is always readability.
- Django integration with celery so one has an UI to call the tasks. I read that the integration has improved in [celery 3.1](http://docs.celeryproject.org/en/latest/whatsnew-3.1.html#django-supported-out-of-the-box )
- Location of the documents: In general should be a good idea to crawl first and the do the semafor parsing. One of my previous posts: [Django + Celery + Readability = Python relevant content crawler](http://danielfrg.github.io/blog/2013/09/11/django-celery-readability-crawler/)
- Location of the semafor output: A better place where analytics can be run easily, maybe a graph database. [Neo4j](http://www.neo4j.org/) should be easy to get running and integrated, but havn't use it.
- Progress bars are always nice, a solution as described [here](http://docs.celeryproject.org/en/latest/userguide/tasks.html#custom-task-classes) and [integration with django](https://djangosnippets.org/snippets/2898/)

If you have any other suggestion, improvement or question leave a comment.
Or did you ran this on the whole [wikipedia](http://www.lsi.upc.edu/~nlp/wikicorpus/) and found something interesting? Let me know that to.
