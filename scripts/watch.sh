#!/bin/sh

mkdir -p build/development
mkdir build/development/js
cp -R src/index.html build/development/

export NODE_ENV=development

node_modules/.bin/browserify \
	--require react \
	--require react-dom > build/development/js/react-libs.js

node_modules/.bin/watchify src/index.tsx \
	--outfile build/development/js/index.js \
	--external react \
	--external react-dom \
	--standalone WwPersonSearchVerify \
	--plugin [ tsify --noImplicitAny --jsx react --target es6 --strictNullChecks ] \
	--debug \
	--verbose
