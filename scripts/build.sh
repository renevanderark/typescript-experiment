#!/bin/sh

mkdir -p build/development
mkdir build/development/js
cp -R src/index.html build/development/

export NODE_ENV=development

node_modules/.bin/browserify \
	--require react \
	--require react-dom > build/development/js/react-libs.js

node_modules/.bin/browserify src/index.js \
	--external react \
	--external react-dom \
	--standalone WwPersonSearchVerify \
	--transform [ babelify ] > build/development/js/index.js
