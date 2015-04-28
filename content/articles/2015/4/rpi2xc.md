Title: Cross-compiling zmq for the raspberry pi in a docker container
Slug: rpi2-xc-zmq-docker
Date: 2015-04-25
Tags: rpi,docker,cross-compile,zmq
Author: Daniel Rodriguez
Status: draft

This post describes how to cross-compile zmq (4.1.0-rc1) inside a docker container for the raspberrypi. Explaining what i have found the best development process for it.

I got a new [Raspberry pi 2](https://www.raspberrypi.org/raspberry-pi-2-on-sale/) a couple of weeks ago hoping to start developing some electronics again, I have also been wanting to to do some C again, the no python challenge.

Suddenly I found out that developing was going to be a pain compared to simple python or C development code, compiling in the pi can take a while and you don't want to have an IDE/text editor in the pi since it's slow, finally moving the files from your favorite IDE can be a (simple to solve) challenge.

I always want all the responsiveness in my development process as possible.

Looking for a solution I found that you can cross-compile your C libraries, meaning you compile in a different computer (OS, architecture, or whatever) than the one you are actually going to run the code.

The instruction for cross-compiling for the pi are all over the internet, doing it in OS X nativelly can be a little bit more challenging and i didn't want to go that route. Thankfully there is [docker](https://www.docker.com/). 

I created a docker container (`FROM ubuntu`) with most of the elements necesary to cross-compile any C or C++ library. The `Dockerfile` can be found in [the git repo](https://github.com/danielfrg/rpi2xc) with a very simple C "Hello World" example.

You can of course pull the docker image with one command: `docker pull danielfrg/rpi2xc`. It should have all that you need to get you started, cross-compile toolchain, environment variables and so on. <3 docker.

## ZeroMQ

I love zmq it even when i hate it. It's a powerful tool that I have used a bit in the past and want to start using again. Its possible to find zmq packages ready for the pi but this was also anexercise, a more real example on cross-compiling a real C++ project. I was easier than expected.

In addition to the container you need you need to copy the `/usr` and `/lib` directories from the raspberry pi to your laptop and share them with the container using the `-v /Users/drodriguez/code/raspberrypi/rpi2xc/rootfs:/rootfs` flag. Since the zmq library will be linked to those libraries.

Download zmq (4.1.0-rc1): [http://download.zeromq.org](http://download.zeromq.org/) into the workspace directory. Share it with the `-v /Users/drodriguez/code/raspberrypi/rpi2xc/workspace:/workspace` flag.

Structure should be like this:

- `./rootfs/usr/...`
- `./rootfs/lib/...`
- `./workspace/zeromq-4.1.0/...`

Pull the docker image and start a bash session sharing a specified volumes: 

```bash
$ docker run -it -v /Users/drodriguez/code/raspberrypi/rpi2xc/rootfs:/rootfs -v /Users/drodriguez/code/raspberrypi/rpi2xc/workspace:/workspace rpi2xc
```

Note that of course you need to change those paths to a valid location on you laptop.

Inside the container:

1. `cd /workspace/zeromq-4.1.0`
2. `./configure --host=arm-none-linux-gnueabi --with-sysroot=/root CFLAGS='--sysroot=/rootfs'`
3. `make`

Done! ZeroMQ was compiled for the RaspberryPi. It should take around two minutes, docker container download time included.

Now you just have to move the compiled code to the pi. You can do that using rsync: `rsync -rl --delete-after --safe-links ./workspace/zeromq-4.1.0 pi@raspberry:.`

If you want to go a little bit crazy can use [`watchdog`](https://pypi.python.org/pypi/watchdog) to listen to file events and do it automatically.

Now we can cross-compile something using the zeromq library.

Paste `hellozmq.c` in the workspace directory so it will be shared with the docker container.

```
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <assert.h>
#include <zmq.h>

int main (void)
{
    //  Socket to talk to clients
    void *context = zmq_ctx_new ();
    void *responder = zmq_socket (context, ZMQ_REP);
    int rc = zmq_bind (responder, "tcp://*:5555");
    assert (rc == 0);

    while (1) {
        char buffer [10];
        zmq_recv (responder, buffer, 10, 0);
        printf ("Received Hello\n");
        sleep (1);          //  Do some 'work'
        zmq_send (responder, "World", 5, 0);
    }
    return 0;
}
```

Now inside of docker you can compile it:

```
$CC hellozmq.c -Wall -L/workspace/zeromq-4.1.0/src/.libs -lzmq -I/workspace/zeromq-4.1.0/include
```
