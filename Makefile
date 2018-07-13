PY=python
PELICAN=pelican
PELICANOPTS=

BASEDIR=$(CURDIR)
INPUTDIR=$(BASEDIR)/content
OUTPUTDIR=$(BASEDIR)/output
CONFFILE=$(BASEDIR)/pelicanconf.py
PUBLISHCONF=$(BASEDIR)/publishconf.py

FTP_HOST=localhost
FTP_USER=anonymous
FTP_TARGET_DIR=/

SSH_HOST=localhost
SSH_PORT=22
SSH_USER=root
SSH_TARGET_DIR=/var/www

S3_BUCKET=my_s3_bucket

CLOUDFILES_USERNAME=my_rackspace_username
CLOUDFILES_API_KEY=my_rackspace_api_key
CLOUDFILES_CONTAINER=my_cloudfiles_container

DROPBOX_DIR=~/Dropbox/Public/

DEBUG ?= 0
ifeq ($(DEBUG), 1)
	PELICANOPTS += -D
endif                                                                      

all: build

.PHONY: build
build:  ## Generate the output
	$(PELICAN) -s $(CONFFILE) $(PELICANOPTS)

.PHONY: clean
clean:  ## Remove the generated output
	@rm -rf $(OUTPUTDIR) *.pid

.PHONY: cleanall
cleanall:  ## Remove dev environment
	@rm -rf $(ENV)

.PHONY: regenerate
regenerate:
	$(PELICAN) -r $(INPUTDIR) -o $(OUTPUTDIR) -s $(CONFFILE) $(PELICANOPTS)

.PHONY: serve
serve:  ## Serve the output
ifdef PORT
	cd $(OUTPUTDIR) && $(PY) -m pelican.server $(PORT)
else
	cd $(OUTPUTDIR) && $(PY) -m pelican.server
endif

.PHONY: devserver
devserver:  ## Start the live-reload webserver
ifdef PORT
	$(BASEDIR)/develop_server.sh restart $(PORT)
else
	$(BASEDIR)/develop_server.sh restart
endif

.PHONY: stopserver
stopserver:  ## Stop the live-reload webserver
	kill -9 `cat pelican.pid`
	kill -9 `cat srv.pid`
	@echo 'Stopped Pelican and SimpleHTTPServer processes running in background.'

.PHONY: publish
publish:  ## Generate output ready for publish
	$(PELICAN) -s $(PUBLISHCONF) $(PELICANOPTS)

.PHONY: bootstrap
bootstrap:  ## Create the dev environment
	@echo "==> Bootstrapping environment"
	@pipenv install --skip-lock

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
