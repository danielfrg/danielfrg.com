Title: Multicorn + conda for Postgres Foreign Data Wrappers in Python
Slug: multicorn-docker-conda
Date: 2015-10-06
Tags: Postgres,Multicorn,Python,conda,Docker
Author: Daniel Rodriguez
Status: draft

[Multicorn](http://multicorn.org/) is (in my opinion) one of those hidden gems in the python community.
It is basically a wrapper for [Postgres Foreign data wrappers](https://wiki.postgresql.org/wiki/Foreign_data_wrappers)
and it makes it really easy to develop one FDW in python. What that means is that it allows to use what is probably the most common and used database right now, Postgres, as a frontend for sql queries while allowing to use different (custom) backends for data storage and even computation.

Unfortunately its not really known and therefore used, the only real example I have been impress with is a talk by Ville Tuulos: [How to Build a SQL-based Data Warehouse for 100+ Billion Rows in Python](https://www.youtube.com/watch?v=xnfnv6WT1Ng) where he talks about how AdRoll *"built a custom, high-performance data warehouse in Python which can handle hundreds of billions of data points with sub-minute latency on a small cluster of servers"*.

That talk is a only a year old but to be honest the first time I saw it and tried to use Multicorn it was a complete failure. Fortunately things have improved and now also we have Docker and conda. I was really curious to see how to difficult would it be to combine these two to make a simple Pandas FDW. Basically use pandas to read a CSV and filter using Pandas instead of Postgres.

There are a couple of Multicorn docker container in Docker Hub but I decided to do my own specially because the ones I found were not based on the Postgres docker container. Source can be found in [Github: docker-multicorn](https://github.com/danielfrg/docker-multicorn) or it can be pulled just by doing `docker pull danielfrg/multicorn`.

When started the container will install any python library on `/src` since this is required for Multicorn to use the custom FDW.

It also includes a couple of examples on how to use the image.

## Simple CSV

This example is bascially a copy of one of Multicorn examples
where they just load a `csv` file using just the python std-library I just use the iris dataset here.

```
$ docker run -p 5432:5432 -v $(pwd):/src multicorn
```

Connect to the Database (using pgadmin for example) create the FDW and Foreign table.

```
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

```
select * from csvtest;
select sepal_width from csvtest;
```

## Pandas

That simple example shows what is possible but is very useless. In Ville Tuulos talk he uses Numba to make some computation, the easiest way to use Numba is to using conda so the docker container also includes conda so you can create a custom container with the extra packages needed. In this case I am just using pandas.

The code for a custom FDW could not be simpler honestly:

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

```
$ docker build -t pandasfdw .
$ docker run -p 5432:5432 -v $(pwd):/src pandasfdw
```

Create the FDW and table in a similar way as before:

```
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

Now you can query the table:

```
SELECT * from pandastable;
```

Since we implemented the less than operation we can do:

```
SELECT * from pandastable where sepal_width < 2.5;
```

What if we do a greater than now?, we don't have that implemented.

```
SELECT * from pandastable where sepal_width > 2.5;
```

Answer is still correct! That is because Postgres will check the conditions anyways but we can do that in the custom FDW when necessary and pass only the values we want to postgres.

## Thoughts

This time it was really straight forward to create the multicorn container and make simple example using pandas.

That code if far (way far) from being useful. For example is reading the CSV file every query (`execute`). It should be possible to load in the `__init__` and use that `df` in the query as shown in one of Multicorn's examples: [statefdw.py](https://github.com/Kozea/Multicorn/blob/master/python/multicorn/statefdw.py).

I am not sure why this method is not more wildly used. One simple idea in my mind is for example: for one of the million SQL-on-Hadoop engines there are now why not make a simple FDW that sends the information to a that engine. It would make it much easier for multiple application in multiple languages to just query postgres (`Psycopg2` in python) rather than have custom libraries in multiple languages with different features on each one. It would also probably make custom DSLs like blaze and ibis target more backends easier.

One of the reasons in my mind is that FDW do not pass some operations to the Custom FDW.
The easy example is `group by` that gets executed by postgres using the data passed back from the FDW.
Also each SQL engine has its own characteristics, features and DLL and being constrain to Postgres
is probably not an option on those cases.
