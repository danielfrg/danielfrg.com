SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


first: help


build: npm-build  ## Build site

# ------------------------------------------------------------------------------
# Python (Notebooks)

env:
	mamba env create


notebooks:  ## Convert notebooks
	python nbconvert/convert.py


cleangen:  ## Clean generated notebooks
	rm -rf content/blog/generated-*/*.md


check:  ## Check linting
	cd $(CURDIR)/python; flake8
	cd $(CURDIR)/python; isort --check-only --diff --recursive --project dinero --section-default THIRDPARTY .
	cd $(CURDIR)/python; black --check nbconvert


fmt:  ## Format source
	cd $(CURDIR)/python; isort --recursive --project dinero --section-default THIRDPARTY.
	cd $(CURDIR)/python; black nbconvert


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
	rm -rf $(CURDIR)/.out
	rm -rf $(CURDIR)/.next


cleanalljs: cleanjs  ## Clean JS files
	rm -rf $(CURDIR)/node_modules
	rm -rf $(CURDIR)/package-lock.json


# ------------------------------------------------------------------------------
# Other

clean: cleanjs  ## Clean build files


cleanall: clean cleangen  ## Clean everything


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
