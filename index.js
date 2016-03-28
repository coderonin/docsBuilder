var glob = require("glob"),
	fs = require('fs'),
	path = require('path'),
	colors = require('colors'),

	//Variables

	blockRegx = /\/\*\*(.|[\n\r])*?\*\//g,
	lineRegx = /\*[^\/\*]*\b/g,
	docType = /\*\s*@\S*/g;

function parseContent(fileName){
	var data = fs.readFileSync(fileName, 'utf8'),
		blocks = data.match(blockRegx);
	return blocks || [];
}

function readDocumentationMetadata(block){
	var metadata = { description: "", params : []},
		lines = block.match(lineRegx);
	lines.forEach(function(ln){
		var type = docType.exec(ln.trim());
		if(type){
			var attr = type[0].replace(/\* @/g,""),
				args = ln.replace(type,"").trim().split(" ");
			switch(attr){
				case "class":
				case "member":
				case "method":
					metadata[attr] = args[0];
					break;
				case "private":
					metadata.private = true;
					break;
				case "param":
					metadata.params.push({
						type: args[0],
						name: args[1],
						description : args.slice(2).join(" ")
					});
					break;
				case "returns":
					metadata.returns = {
						type: args[0],
						description : args.slice(1).join(" ")
					};
					break;
				default:
					console.log(attr.red);
					console.log(args.red);
					break;
			}
		}else{
			console.log(ln.red);
			metadata.description += ln.replace(/\* /g, "") + " ";
		}
	});
	return metadata;
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
		console.log(meta);
	});

	console.log("========================================================".green);
	console.log("    Building references Complete...");
	console.log("========================================================".green);

	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);
}

module.exports = docsBuilder;