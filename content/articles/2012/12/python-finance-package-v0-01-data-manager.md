Title: Python Finance Package v0.01 - Data Manager
Slug: python-finance-package-v0-01-data-manager
Date: 2012-12-13 12:59
Tags: Coursera,Finance,Pandas,Python,Computational investing
Author: Daniel Rodriguez

I have learned a lot from my most recent Coursera Course: [Computational
Investing Part 1][]. The language used on the class is Python so I
couldn't be happier; we are using a package called [QSTK][] developed by
some people at Georgia Tech, who are also responsible for the class.

The quality of the package is amazing, has a tons of features, but one
area I notice the package to has to be improved is the data downloading
and management.

I decide to write some python scripts to help me with this problem, and
later on I decide to write a very simple Python Package with a few utils
to help me on this class and future finance projects. A little bit an
alternative to QSTK and a little bit a complement for it.

At the same time I decide to make the jump from Python 2.7 to Python
3.2, this makes QSTK useless for now. The transition from 2.7 to 3.2 was
very smooth, I still write `print var` instead of `print(var)` a **lot**
of times but is a minor issue.

For now the package only has the Data Management part but yesterday I
finished my final exams so I have a little bit of time to work on this.

How it works
------------

You tell the symbol/symbols, dates  and the fields (columns) you want
from the stocks. The package automatically downloads the information
from Yahoo! Finance and loads the information into a Pandas DataFrame.
Before downloading the package checks if the information is already
downloaded looking into already downloaded information, and
optional (default True) saves a pickled version of the DataFrame to load
faster the next time.

Example
-------

```python
from datetime import datetime
from finance.data import DataAccess

da = DataAccess("./data/")
symbols = ["AAPL", "GLD", "GOOG", "SPY", "XOM"]
start_date = datetime(2008, 1, 1)
end_date = datetime(2009, 12, 31)
fields = "Close"

close = da.get_data(symbols, start_date, end_date, fields,
save=False)
print(close)
```

### Little Benchmark

Just using `clock()` and `time()` to see if it was worth it. It is.

    Directory empty: Download and save 5 stocks
        1.4336301090943933 1.434000015258789
    Load 5 stocks from .csv
        0.023402424167761726 0.023000001907348633
    Load 5 stocks from serialized
        0.0007370202310554852 0.0009999275207519531

Where to find the code
----------------------

On github: [PythonFinance][]. This is such a small package is necessary
to manually download it and put it on a folder where you have other
python packages.


  [Computational Investing Part 1]: https://class.coursera.org/compinvesting1-2012-001/class/index
    "Computational Investing - Part 1"
  [QSTK]: http://wiki.quantsoftware.org/index.php?title=QuantSoftware_ToolKit
    "QSTK"
  [PythonFinance]: https://github.com/danielfrg/PythonFinance
    "PythonFinance"
