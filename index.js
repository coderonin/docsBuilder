var glob = require("glob"),
	path = require('path'),
	colors = require('colors');

function docsBuilder(pattern, options){
	var files = [];

	console.log("========================================================".green);
	console.log("    Begin files reading...");
	console.log("========================================================".green);

	glob.sync(pattern).forEach( function( file ) {
		var fileName = path.resolve(file);
		console.log(" -- Reading: ".green + fileName);
		files.push(fileName);
	});

	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);
}

module.exports = docsBuilder;