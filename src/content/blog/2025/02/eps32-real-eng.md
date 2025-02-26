---
title: "Programming an ESP32 like a real eng"
slug: "eps32-real-eng"
pubDate: 2025-02-26
tags: ["esp32", "ide"]
summary: "NO IDEs (they suck)"
draft: true
---

I want to program ESP32's. But I am a real eng, i use no IDEs.

I want to use nvim and the terminal.

What we need to setup is [espressif/esp-idf](https://github.com/espressif/esp-idf).

Their instructions are terrible, and their installs scripts even worst.
They create Python virtual environments, you can't tell it not to.
I don't want to convert (and most importantly maintain) other scripts.

I started with `conda` as a solution. It works... but I am trying to stay away
from conda at this point, i feels it finally came it's time (I still use it for CUDA).

The good news is we can also use `uv`. So just do:

Clone repo:

```
git clone https://github.com/espressif/esp-idf.git ~/dev/esp/eps-idf
```

We create a `.python-version` file with the version we want to use `3.13`
And then simply run:

```
cd ~/dev/esp/esp-idf
uv run ./install.sh
```

This will use `uv`s Python to create the virtual env and whatever esp-idf does.
We can check this actually worked:

```
❯ ll ~/.espressif/python_env/idf5.5_py3.13_env/bin/python
lrwxr-xr-x@ - danrodriguez 25 Feb 19:05 /Users/danrodriguez/.espressif/python_env/idf5.5_py3.13_env/bin/python -> python3
```

Now installation is ready at: `~/.espressif`

Just need to source source:

```
. ./export.sh
```

## Flashing a program

It's not perfect, but this ticket will help eventually.
https://github.com/astral-sh/uv/issues/6265
