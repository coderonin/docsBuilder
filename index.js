var glob = require("glob"),
	fs = require('fs'),
	path = require('path'),
	colors = require('colors'),

	//Variables

	blockRegx = /\/\*\*(.|[\n\r])*?\*\//g,
	lineRegx = /\*[^\/\*]*\b/g;

function parseContent(fileName){
	var data = fs.readFileSync(fileName, 'utf8'),
		blocks = data.match(blockRegx);
	return blocks || [];
}

function readDocumentationMetadata(block){
	var lines = block.match(lineRegx);
	return lines;
}

function docsBuilder(pattern, options){
	var files = [],
		blocks = [];

	console.log("========================================================".green);
	console.log("    Begin files reading...");
	console.log("========================================================".green);

	glob.sync(pattern).forEach( function( file ) {
		var fileName = path.resolve(file);
		console.log(" -- Reading: ".green + fileName);
		blocks = blocks.concat(parseContent(fileName));
	});

	console.log("========================================================".green);
	console.log("    Building references...");
	console.log("    Blocks: " + blocks.length);
	console.log("========================================================".green);

	blocks.forEach(function(block){
		var meta = readDocumentationMetadata(block);
		meta.forEach(function(line){
			console.log(line);
		});
	});

	console.log("========================================================".green);
	console.log("    Building references Complete...");
	console.log("========================================================".green);

	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);
}

module.exports = docsBuilder;