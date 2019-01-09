PREFIX?=$(shell pwd)

all: build

.PHONY: build
build: clean notebooks hugo ##

.PHONY: hugo
hugo: ##
	hugo

.PHONY: notebooks
notebooks: ##
	python nbconvert/convert.py

.PHONY: clean-notebooks
clean-notebooks: ##
	rm -rf content/blog/generated/*.md

.PHONY: server
server: ##
	hugo serve -F -D

.PHONY: clean
clean: clean-notebooks ##
	rm -rf public

PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
