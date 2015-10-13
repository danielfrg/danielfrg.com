Title: Python Finance Package v0.02 – Basic Utils and Market Simulator
Slug: python-finance-package-v0-02-basic-utils-and-market-simulator
Date: 2012-12-17 15:00
Tags: Coursera,Finance,Pandas,Python,Computational investing
Author: Daniel Rodriguez

Continuing with the **(Basic)** Python Finance Package. Now has some
basic utils: total-return, daily-returns, and sharpe-ratio calculations.
Also a Market Simulator, the purpose was to solve the [Computational
Investing][] Homework 3.

Changes on DataAccess
---------------------

1.  Now the index of the DataFrame is DatetimeIndex not string. With
    this is possible to index it with datetimes.
2.  Moved the classes folder from './data/' to './utils/'
3.  Improved Documentation

Market Simulator
----------------

Reads a .csv file with the orders/trades. Downloads the necessary data
(symbols and dates between the ). Makes a simulation of the orders:

The .csv file looks like this:

    year,month,day,symbol,action,num_of_shares
    2011,1,10,AAPL,Buy,1500
    2011,1,13,AAPL,Sell,1500
    2011,1,13,IBM,Buy,4000
    2011,1,26,GOOG,Buy,1000
    2011,2,2,XOM,Sell,4000
    2011,2,10,XOM,Buy,4000
    2011,3,3,GOOG,Sell,1000
    2011,3,3,IBM,Sell,2200
    2011,6,3,IBM,Sell,3300
    2011,5,3,IBM,Buy,1500
    2011,6,10,AAPL,Buy,1200
    2011,8,1,GOOG,Buy,55
    2011,8,1,GOOG,Sell,55
    2011,12,20,AAPL,Sell,1200

How to use it:

1.  Set the initial amount of cash
2.  Run the simulation,  as an argument give the path to the csv file
3.  See the the information

```python
from finance.sim import MarketSimulator

sim = MarketSimulator()
sim.initial_cash = 1000000
sim.simulate(&quot;MarketSimulator_orders.csv&quot;)
print(sim.portfolio[0:10])

import matplotlib
matplotlib.use('Qt4Agg') \# Probably most people dont need this line
import matplotlib.pyplot as plt
sim.portfolio.plot()
plt.show()
```

Output:

               Portfolio
    Date
    2011-01-10  1000000
    2011-01-11   998785
    2011-01-12  1002940
    2011-01-13  1004815
    2011-01-14  1009415
    2011-01-18  1011935
    2011-01-19  1031495
    2011-01-20  1031935
    2011-01-21  1030775
    2011-01-24  1046815

![Simulated portfolio value](/images/blog/2012/12/finance02/portfolio_value.png "Simulated portfolio value")

Basic Utils
-----------

With the portfolio ready we can get some info about it, for example the
total return and sharpe ratio.

```python
print('Total Return:', total_return(sim.portfolio, 'Portfolio'))
print(sharpe_ratio(sim.portfolio, extraAnswers=True))
```

Which prints:

```python
Total Return: 0.1338600000000001

{'std': 0.0071901402219816928, 'sharpe_ratio': 1.1836398092874625, 'mean': 0.0005493527495690362}
```

Conclusion
----------

Next step is to implement an Event Profiler to solve Homework 4.

**Where to find the code?** On github: [PythonFinance][]

  [Computational Investing]: https://class.coursera.org/compinvesting1-2012-001/class/index
    "Computational Investing"
  [PythonFinance]: https://github.com/danielfrg/PythonFinance
