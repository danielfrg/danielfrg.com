danielfrg.github.com-surce
==========================

Source for danielfrg.github.io

## How to use

`git clone git@github.com:danielfrg/danielfrg.github.io-source.git blog --recusive`
to clone this repo and its submodules.

Requires:

- `brew install nodejs`

## How to update the submodules

Need to add a new remote

- `cd plugins/ipynb`
- `git remote rm origin`
- `git remote add origin git@github.com:danielfrg/pelican-ipynb.git`

- `cd themes/middle`
- `git remote rm origin`
- `git remote add origin git@github.com:danielfrg/middle-theme.git`

After that is possible to push from the submodules
