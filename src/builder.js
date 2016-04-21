var u = require(__dirname + "/utils.js"),
	fs = require('fs'),
	fsSync = require('fs-sync'),
	colors = require('colors'),
	jade = require('jade'),
	rimraf = require('rimraf').sync,

	// Variables

	cssPath 	= __dirname + "/../web/css/",
	jsPath 		= __dirname + "/../web/js/",
	fontsPath 	= __dirname + "/../web/fonts/",
	imgsPath	= __dirname + "/../web/img/",
	staging 	= __dirname + "/../staging";

// Compile a tpl functions
var indexTplFn = jade.compileFile(__dirname + "/../web/index.jade", {});
var mdTplFn = jade.compileFile(__dirname + "/../web/document.jade", {});

function write(docsData, menuData, autoCompleteData, destFolder){

	if (fs.existsSync(staging)){
		rimraf(staging);
	}

	fsSync.mkdir(staging);
	fsSync.mkdir(staging + "/mds");

	fsSync.copy(cssPath, staging + "/css");
	console.log(' -- Writing'.green +' CSS: Done!');

	fsSync.copy(jsPath, staging + "/js");
	console.log(' -- Writing'.green +' JS: Done!');

	fsSync.copy(fontsPath, staging + "/fonts");
	console.log(' -- Writing'.green +' Fonts: Done!');

	fsSync.copy(imgsPath, staging + "/css/img");
	console.log(' -- Writing'.green +' Images: Done!');

	fsSync.copy(__dirname + "/../web/home.html", staging +"/mds/home.html");
	
	u.forOwn(docsData, function(data, cls){
		var md = mdTplFn({ doc: data});
		fs.writeFileSync(staging +"/mds/"+cls+".html", md);
		console.log(' -- Writing Document For: '.green + cls);
	});

	var index = indexTplFn({ data: JSON.stringify(menuData), autoComplete: JSON.stringify(autoCompleteData) });
	fs.writeFileSync(staging +"/index.html", index);
	console.log(' -- Writing'.green +' Index: Done!');

	if (fs.existsSync(destFolder)){
		rimraf(destFolder);
	}

	fsSync.copy( staging, destFolder);
	rimraf(staging);
}

module.exports = {
	write: write
};