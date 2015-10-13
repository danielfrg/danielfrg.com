Title: Using cloud9 to save computing power and to code from everywhere too
Slug: using-cloud9-to-save-computing-power-and-to-code-from-everywhere-too
Date: 2012-11-03 14:46
Tags: Cloud9,Computational investing,Coursera,Numpy,Python
Author: Daniel Rodriguez

I am taking my second course on [Coursera][] Computational Investing -
Part 1; pretty fun so far. The homework 1 was to find a portfolio of 4
equities with the best (highest) Sharpe ratio from 2011. With a little
bit of coding in python I was able to download all SPY stocks and loop
through out the different combinations of them with different weights to
find the best portfolio. The problem I found was that my PC is to slow
for this task :(

First I have to said I am not an algorithm expert so the process is
linear, but I was able to optimize a little bit the process by loading
into memory first all the data and some other little stuff that makes
the calculation faster; that is from 1 1/2 minutes initially to 30
seconds combining 5 stocks. And I was able to combine up to 8 stocks on
my PC without any problem but when I try to combine more than 8 well it
was so much for my PC; I even take a shower and the calculation wasn't
over, that is my limit :P

There are solutions to make this type of calculation on the cloud such
as [PiCloud][] a service that I am definitely going to try out soon but
I found [cloud9][] was a solution to this problem too.

Cloud 9 says they are the Google Docs for code and they really are.
Initially I had my doubts about the online editor mainly because I love
[Sublime text][], and yes it is not so powerful as sublime but is
**very** good. But the features such the Github integration and the
online terminal sold me the service, I test it and didn't disappoint me.

I was able with one-click to clone the repository on my Github and run
the code on their infrastructure (powered by [OpenShift][]) with no
problems at all. Just need to install the required libraries ([numpy][]
- running `easy_install numpy`) and then it was as simple as run `python portfolio.py` and see the code running much faster than on my PC.

Also the ability to run the code and edit it from everywhere is amazing.
I was able to connect from my University and keep testing better
portfolios. On the image below I ran 83 iteration of the code in less
than 3 seconds, on my PC takes 20 seconds or more. The max number of
iterations I ran was up to 250k taking up to 8 minutes. And after
modifying the code I was able to push from Cloud9 directly to my Github
and back to my PC. Git makes the flow is very smooth and the terminal
from Cloud9 good enough for that and more.

![Cloud9](/images/blog/2012/11/cloud9/comp-investing-cloud9-google-chrome_001.png "Running code in the Cloud9 Terminal")

The service has some problems, sometimes the terminal goes crazy for no
reason (that I could find) and I had to refresh the page, but in general
works great.

I found this a very easy way to execute code on the cloud saving
computing power and getting faster responses. Next I want to try
[PiCloud][] and [OpenShift][] directly.

The code for the computational investing is on [my Github][] if anyone
is interested, is going to be updated as the course goes through.

  [Coursera]: https://www.coursera.org/ "Coursera"
  [PiCloud]: http://www.picloud.com/ "PiCloud"
  [cloud9]: https://c9.io/ "Cloud9"
  [Sublime text]: http://www.sublimetext.com/ "Sublime Text"
  [OpenShift]: https://openshift.redhat.com/app/ "OpenShift"
  [numpy]: http://numpy.scipy.org/ "numpy"
  [my Github]: https://github.com/danielfrg/comp-investing
    "Computational Investing on Github "
