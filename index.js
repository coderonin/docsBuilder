var glob = require("glob"),
	path = require('path'),
	colors = require('colors');

function docsBuilder(pattern, options, cb){
	var files = [];

	console.log("========================================================".green);
	console.log("    Comienza lectura de archivos...");
	console.log("========================================================".green);

	glob.sync(pattern).forEach( function( file ) {
		var fileName = path.resolve(file);
		console.log(" -- leyendo: ".green + path.resolve(file));
		files.push(path.resolve(file));
	});

	console.log("========================================================".green);
	console.log("    Lectura completada...");
	console.log("========================================================".green);
}

module.exports = docsBuilder;