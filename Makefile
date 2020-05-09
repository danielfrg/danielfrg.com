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

.PHONY: clean
clean:  ## Clean build files
	@rm -rf public
	@find . -type f -name '*.py[co]' -delete
	@find . -type d -name __pycache__ -exec rm -rf {} +
	@find . -type d -name .ipynb_checkpoints -exec rm -rf {} +


.PHONY: cleanall
cleanall: clean   ## Clean everything
	@ rm -rf content/blog/generated/*.md


.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'

# ------------------------------------------------------------------------------
# Project specific

.PHONY: env  ## Create dev environment
env:
	conda env create


.PHONY: build
build: clean notebooks hugo  ## Build site


.PHONY: hugo
hugo: ##
	hugo


.PHONY: notebooks
notebooks:  ## Convert notebooks
	python nbconvert/convert.py


.PHONY: serve
serve:  ## Serve website
	hugo serve -F -D


.PHONY: netlify
netlify: build  ## Build docs on Netlify


.PHONY: check
check:  ## Check linting
	@flake8
	@isort --check-only --diff --recursive --project dinero --section-default THIRDPARTY nbconvert
	@black --check nbconvert


.PHONY: fmt
fmt:  ## Format source
	@isort --recursive --project dinero --section-default THIRDPARTY nbconvert
	@black nbconvert
