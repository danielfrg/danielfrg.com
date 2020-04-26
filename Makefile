SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


all: build

.PHONY: build
build: clean notebooks hugo ##

.PHONY: hugo
hugo: ##
	hugo

.PHONY: notebooks
notebooks: ##
	python nbconvert/convert.py

.PHONY: serve
serve: ##
	hugo serve -F -D

.PHONY: clean
clean: clean-notebooks ##
	rm -rf public

.PHONY: clean-notebooks
clean-notebooks: ##
	rm -rf content/blog/generated/*.md

.PHONY: netlify
netlify: build  ## Build docs on Netlify

.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
