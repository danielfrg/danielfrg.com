SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


first: help


all: notebooks npm-build  ## Build site

# ------------------------------------------------------------------------------
# Python (Notebooks)

env:
	poetry install


notebooks:  ## Convert notebooks
	python nbconvert/convert.py


cleangen:  ## Clean generated notebooks
	rm -rf $(CURDIR)/content/blog/generated-*/*.md


check:  ## Check linting
	cd $(CURDIR)/python; flake8
	cd $(CURDIR)/python; isort --check-only --diff .
	cd $(CURDIR)/python; black --check .


fmt:  ## Format source
	cd $(CURDIR)/python; isort .
	cd $(CURDIR)/python; black .

# ------------------------------------------------------------------------------
# JS

npm-build:  ## Build website
	npm run build
	npm run export


npm-i: npm-install
npm-install:  ## Install JS dependencies
	npm install


npm-dev:  ## Run dev server
	npm run dev


cleanjs:  ## Clean JS files
	rm -rf $(CURDIR)/out
	rm -rf $(CURDIR)/.next


cleanalljs: cleanjs  ## Clean JS files
	rm -rf $(CURDIR)/node_modules
	rm -rf $(CURDIR)/package-lock.json


# ------------------------------------------------------------------------------
# Other

clean: cleanjs  ## Clean build files


cleanall: cleanalljs cleangen  ## Clean everything


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
