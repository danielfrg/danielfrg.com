# My site

Source for [danielfrg.com](http://danielfrg.com)

## How to use

Clone this repo and its submodules:

```
git clone git@github.com:danielfrg/danielfrg.com --recursive
```

Requires:

```
brew install nodejs
conda env create
conda activate danielfrg.com
```

Running

```
make build serve
```

## How to update the submodule

Need to add a new remote to the submodule

```
cd plugins/ipynb
git remote rm origin
git remote add origin git@github.com:danielfrg/pelican-ipynb.git
git checkout master
```

After that is possible to push from the submodule
