#!/usr/bin/env node

var browserSync = require("browser-sync").create();
var debounce = require("lodash.debounce");
var modRewrite = require("connect-modrewrite");
var url = require("url");

var baseDir = "./build/development";
var watchFiles = [
	baseDir + "/js/*.js",
	baseDir + "/css/*.css",
	baseDir + "/index.html"
];

function onFilesChanged(event, file) {
	if (event === "change") {
		browserSync.reload(file);
	}
}

browserSync.watch(watchFiles, debounce(onFilesChanged, 300));

browserSync.init({
	server: {
		baseDir: baseDir,
		middleware: [
			modRewrite([
				"^/css/(.*)$ /css/$1 [L]",
				"^/js/(.*).js$ /js/$1.js [L]",
				"^/?.*$ /index.html [L]"
			])
		]
	}
});
