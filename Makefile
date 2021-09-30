SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


first: help


all: notebooks website  ## Build site


# ------------------------------------------------------------------------------
# Python (Notebooks)

env:  ## Create Python env
	poetry install --with dev


notebooks:  ## Convert notebooks
	python nbconvert/convert.py


check:  ## Check linting
	cd $(CURDIR)/nbconvert; isort . --check-only --diff
	cd $(CURDIR)/nbconvert; black . --check
	cd $(CURDIR)/nbconvert; flake8


fmt:  ## Format source
	cd $(CURDIR)/nbconvert; isort .
	cd $(CURDIR)/nbconvert; black .


cleangen:  ## Clean generated notebooks
	rm -rf $(CURDIR)/content/blog/generated-*/*.md


resetpython:  ## Reset Python
	rm -rf .venv


# ------------------------------------------------------------------------------
# JS

website:  ## Build website
	npm run build
	npm run export


npm-install:  ## Install JS dependencies
	npm install
npm-i: npm-install


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

help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
