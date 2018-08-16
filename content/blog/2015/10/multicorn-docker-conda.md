Title: Multicorn in Docker + conda for Postgres Foreign Data Wrappers in Python
Slug: multicorn-docker-conda
Date: 2015-10-06
Tags: Postgres,Multicorn,Python,Conda,Docker
Author: Daniel Rodriguez

[Multicorn](http://multicorn.org/) is (in my opinion) one of those hidden gems in the python community.
It is basically a wrapper for [Postgres Foreign data wrappers](https://wiki.postgresql.org/wiki/Foreign_data_wrappers)
and it makes it really easy to develop one in python.
What that means is that it allows to use what is probably the most common and used database right now,
Postgres, as a frontend for sql queries while allowing to use different data storage and even computation.

Unfortunately its not really known and therefore used, the only real example I have been impress
with is a talk by Ville Tuulos: [How to Build a SQL-based Data Warehouse for 100+ Billion Rows in Python](https://www.youtube.com/watch?v=xnfnv6WT1Ng)
where he talks about how AdRoll *"built a custom, high-performance data warehouse in Python which
can handle hundreds of billions of data points with sub-minute latency on a small cluster of servers"*.

That talk is a only a year old but to be honest the first time I saw it and tried to use Multicorn it was a complete failure.
Fortunately things have improved and now also we have Docker and conda.
I was really curious if it was still difficult to combine these two to make a simple Pandas FDW.
Basically use pandas to read a CSV and filter using Pandas instead of Postgres.

There are a couple of Multicorn docker container in Docker Hub but I decided to do my own specially
because the ones I found were not based on the Postgres docker container.
Dockerfile can be found in [Github: docker-multicorn](https://github.com/danielfrg/docker-multicorn)
or the image can be just pulled by doing `docker pull danielfrg/multicorn`.

When started the container will install any python library on `/src` since this is required for Multicorn to use the custom FDW.

It also includes a couple of examples on how to use the image.

## Simple CSV

This example is basically a copy of one of Multicorn examples
where they just load a `csv` file using just the python std-library I just use the iris dataset here.

<pre class="console">
$ docker run -p 5432:5432 -v $(pwd):/src multicorn
</pre>

Connect to the Database (using pgadmin for example) create the FDW and Foreign table.

```sql
CREATE EXTENSION multicorn;

CREATE SERVER csv_srv foreign data wrapper multicorn options (
    wrapper 'multicorn.csvfdw.CsvFdw'
);

create foreign table csvtest (
      sepal_length numeric,
      sepal_width numeric,
      petal_length numeric,
      petal_width numeric,
      species character varying
) server csv_srv options (
      filename '/src/iris.csv',
      skip_header '1',
      delimiter ','
);
```

Now is possible to make SQL queries to the table.

```sql
select * from csvtest;
select sepal_width from csvtest;
```

## Pandas

That simple example shows what is possible but is very useless. In Ville Tuulos talk he uses Numba
to make some computation, the easiest way to use Numba is to using conda so the docker container
also includes conda so you can create a custom container with the extra packages needed.
In this case I am just using pandas.

The code for the pandas FDW could not be simpler:

```python
from multicorn import ForeignDataWrapper
from multicorn.utils import log_to_postgres


import pandas as pd


class PandasForeignDataWrapper(ForeignDataWrapper):

    def __init__(self, options, columns):
        super(PandasForeignDataWrapper, self).__init__(options, columns)
        self.filename = options["filename"]
        self.columns = columns

    def execute(self, quals, columns):
        log_to_postgres(self.filename)
        df = pd.read_csv(self.filename, engine='python')

        for qual in quals:
            if qual.operator == '<':
                df = df[df[qual.field_name] < qual.value]

        df = df[list(columns)]
        for i, row in df.iterrows():
            yield row.to_dict()

```

Basically:

1. Importing `multicorn.ForeignDataWrapper` and `pandas`
2. Extend a `ForeignDataWrapper` class
3. Define an `execute` method that does the load/computation
4. Implement (or not, see below) the filtering of columns and rows. The `quals` has `.field` `.operator` ('<', '>=', and so on) and a `.value`
5. Yield a dictionary with the columns as keys and values as values

With the code ready just need to build a custom container with my requirements.

```docker
FROM multicorn
RUN conda install -y pandas
```

Now build that image run the container in the same way as the previous one.

<pre class="console">
$ docker build -t pandasfdw .
$ docker run -p 5432:5432 -v $(pwd):/src pandasfdw
</pre>

Create the FDW and table in a similar way as before:

```sql
CREATE EXTENSION multicorn;

CREATE SERVER pandas_srv foreign data wrapper multicorn options (
    wrapper 'pandasfdw.PandasForeignDataWrapper'
);

CREATE FOREIGN TABLE pandastable (
    sepal_length numeric,
    sepal_width numeric,
    petal_length numeric,
    petal_width numeric,
    species character varying
) server pandas_srv options(
    filename '/src/iris.csv'
);
```

Now you can query the table and since we implemented the less than operation we can do:

```sql
SELECT * from pandastable where sepal_width < 2.5;
```

```
sepal_length,sepal_width,petal_length,petal_width,species
4.5;2.3;1.3;0.3;"setosa"
5.5;2.3;4.0;1.3;"versicolor"
4.9;2.4;3.3;1.0;"versicolor"
5.0;2.0;3.5;1.0;"versicolor"
6.0;2.2;4.0;1.0;"versicolor"
6.2;2.2;4.5;1.5;"versicolor"
5.5;2.4;3.8;1.1;"versicolor"
5.5;2.4;3.7;1.0;"versicolor"
6.3;2.3;4.4;1.3;"versicolor"
5.0;2.3;3.3;1.0;"versicolor"
6.0;2.2;5.0;1.5;"virginica"
```

What if we do a greater than now?, we don't have that implemented.

```sql
SELECT * from pandastable where sepal_width > 2.5;
```

```
sepal_length,sepal_width,petal_length,petal_width,species
5.1;3.5;1.4;0.2;"setosa"
4.9;3.0;1.4;0.2;"setosa"
4.7;3.2;1.3;0.2;"setosa"
4.6;3.1;1.5;0.2;"setosa"
5.0;3.6;1.4;0.2;"setosa"
5.4;3.9;1.7;0.4;"setosa"
4.6;3.4;1.4;0.3;"setosa"
5.0;3.4;1.5;0.2;"setosa"
```

Answer is still correct! That is because Postgres will check the conditions anyways but
if we want we can do that in the custom FDW and pass only the values we want to postgres.

## Thoughts

This time it was really straight forward to create the Multicorn container and make simple example using pandas.

That code is far (way far) from being useful. For example is reading the CSV file every query (`execute`).
It should be possible to load in the `__init__` and use that `df` in the query as shown in one of Multicorn's examples: [statefdw.py](https://github.com/Kozea/Multicorn/blob/master/python/multicorn/statefdw.py).

I am not sure why Multicorn and this method is not more wildly used.
One simple idea in my mind is for example: for one of the million SQL-on-Hadoop engines that are
now why not make a simple FDW that sends the information to a that engine.
It would make it much easier for multiple application in multiple languages to just query Postgres
(`Psycopg2` in python) rather than have custom libraries in multiple languages with different features on each one.
It would also probably make custom DSLs like blaze and ibis target more backends easier.

For that particular example I can thing a couple of reason why not to use Multicorn.
For example you cannot do some operations in the Custom FDW:
a `group by` gets executed by Postgres using the data passed back from the FDW.
Also each SQL engine has its own characteristics, features and DLL and being constrain to Postgres
is probably not an option on those cases.

Another simple idea would be to have multiple services (maybe with a ZMQ API) and having postgres making
the requests to those services, that way the clients can just query Postgres as an universal SQL entrypoint.
