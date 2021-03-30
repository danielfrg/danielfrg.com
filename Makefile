SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

PWD := $(shell pwd)

YES ?= 0
LOG ?= info


first: help


build: clean notebooks hugo  ## Build site

# ------------------------------------------------------------------------------
# Python (Notebooks)

env:
	mamba env create


notebooks:  ## Convert notebooks
	python nbconvert/convert.py


check:  ## Check linting
	cd $(CURDIR)/python; flake8
	cd $(CURDIR)/python; isort --check-only --diff --recursive --project dinero --section-default THIRDPARTY .
	cd $(CURDIR)/python; black --check nbconvert


fmt:  ## Format source
	cd $(CURDIR)/python; isort --recursive --project dinero --section-default THIRDPARTY.
	cd $(CURDIR)/python; black nbconvert



# ------------------------------------------------------------------------------
# Hugo


hugo: ## Run hugo build
	hugo


serve:  ## Serve website
	hugo serve -F -D

# ------------------------------------------------------------------------------
# Other

clean:  ## Clean build files
	rm -rf public


cleanall: clean   ## Clean everything
	rm -rf content/blog/generated/*.md


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
