Title: Desktop app to easily create new tasks on all task management web apps
Slug: desktop-app-to-easily-create-new-tasks
Date: 2012-10-14 23:51
Tags: Python,Ecryption,AES,GTD,wxPython,pyexe
Author: Daniel Rodriguez

Recently I have been looking for new ways of manage my tasks, looking
for being more productive and organized with my
master, [coursera][] courses, blog and programming tasks. I am a huge
fan of web apps and the past week I tried almost every (decent = nice
landing page) app on the internet, just to name a
few: [do][], [doit][], [producteev][], [orchestra][], [wunderlist][], [asana][],
[42tasks][] to finally choose [nirvana][].

I selected nirvana because it was the best GTD app I could find and the UI
(very important to me) is pretty good. I haven't read a lot about GTD,
mostly a few videos, but the methodology have been working really great
for me and I have notice a big boost to my organization, before I was
using only Google Calendar. The inbox, next, waiting, schedule, someday
and projects lists are a very good way of organize tasks.

Even though I love web apps because I can access them from everywhere
one big disadvantage of a GTD web app is the task creation process: type
the URL, wait for the app to load and then write the new task. The
solution most web GTD apps have done is to allow the creation of tasks
via email this is good but it is not enough if want to really follow the
GTD approach. The task creation need to be really fast, collect first
and then organize. Having the app on one tab all the time to gain some
seconds is not a solution.

I wanted to use GTD the way it is supposed to so I create a little app
to create task fast via email, so it works on nivana and any other major
task management app that have the option of create tasks via email.

I am a web (HTML5, JS, Django, etc...) fan and try to use web
technologies in most on my projects but the web is not there yet and a
native solution was necessary. I am a python fan, but not even close to
an expert and before this little project never use it to create a
desktop application with UI.

It was really fun to make a desktop app again, almost 3 years have
passed since my time with Java in college. The UI library I select
was [wxPython][] just because it makes sense with what I already knew
from java: the use of grids, vertical and horizontal boxes... also a
pretty decent documentation, support and fits the requirements I had for
the app. Honorable mention to [kivy][] that looks good but couldn't make
it work.

The app is pretty simple: just a mailer application. Enter the username
(gmail), password and email to send and start sending tasks to your
favorite web task management app.

![Settings window](/images/blog/2012/10/tasks-app/2012-10-13_23h20_48.png "Settings windows")

As I said the speed was the most important requirement on this app, so
it  uses a global hot-key (WIN+DEL, just because it works nice on my
keyboard) to summon the application then only needs to write the new
task, press enter and the app hides on the notification area with a
pretty nice icon I get from somewhere. If no longer wants to create the
task press *esc *and it hides waiting to be called.

![Main window](/images/blog/2012/10/tasks-app/2012-10-13_22h57_271.png "Main windows")

Other stuff I learned from making this app was to [encrypt with
AES][] for the password and to create a .exe via [py2exe][]. Cannot
compile to other operating systems because I just don't have them.
Programmers can download the source can run the app ;)

This is a very simple app but it has been working for me and probably
will work for other person. Suggestions are always welcome.

The code is on [github][] and a [zip][] file with the
compiled `.exe` is available.

  [coursera]: http://coursera.org/
  [do]: http://do.com/
  [doit]: http://doit.im/
  [producteev]: http://producteev.com/
  [orchestra]: http://orchestra.com/
  [wunderlist]: http://wunderlist.com/
  [asana]: http://asana.com/
  [42tasks]: http://42tasks.com/
  [nirvana]: http://nirvanahq.com/
  [wxPython]: http://wxpython.org/
  [kivy]: http://kivy.org/
  [encrypt with AES]: https://www.dlitz.net/software/pycrypto/
  [py2exe]: http://py2exe.org/
  [github]: https://github.com/danielfrg/newtask
  [zip]: https://github.com/danielfrg/newtask/blob/master/dist.zip?raw=true
