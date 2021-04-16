SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


first: help

# ------------------------------------------------------------------------------
# JS

build:  ## Build JS
	cd $(CURDIR)/js/; npm run build


i: npm-install
install:  ## Install JS dependencies
	cd $(CURDIR)/js/; npm install


dev:  ## Build JS with watch
	cd $(CURDIR)/js/; npm run dev


clean:  ## Clean JS files
	rm -rf $(CURDIR)/js/dist
	rm -rf $(CURDIR)/../static/theme/*


cleanall: clean  ## Clean All JS files
	rm -rf $(CURDIR)/js/node_modules


# ------------------------------------------------------------------------------
# Other

help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
