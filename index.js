var glob = require("glob"),
	fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	jade = require('jade'),
	//Variables

	blockRegx = /\/\*\*(.|[\n\r])*?\*\//g,
	lineRegx = /\*[^\/\*]*\b/g,
	docType = /\*\s*@\S*/g;

// Compile a function
var templateFn = jade.compileFile(__dirname + "/web/index.jade", {});

function parseContent(fileName){
	var data = fs.readFileSync(fileName, 'utf8'),
		blocks = data.match(blockRegx);
	return blocks || [];
}

function readDocumentationMetadata(block, fileName){
	var metadata = { description: "" },
		lines = block.match(lineRegx);

	lines.forEach(function(ln){
		docType.lastIndex = 0;
		var type = docType.exec(ln.trim());
		
		if(type){
			var attr = type[0].replace(/\*\s*@/g,""),
				args = ln.replace(type,"").trim().split(" ");
			switch(attr){
				case "class":
				case "member":
				case "method":
				case "extends":
				case "config":
				case "property":
				case "event":
					metadata[attr] = args[0];
					break;
				case "private":
				case "singleton":
					metadata[attr] = true;
					break;
				case "param":
					if(!metadata.params) metadata.params = [];
					metadata.params.push({
						type: args[0].replace(/({|})/g,""),
						name: args[1],
						description : args.slice(2).join(" ")
					});
					break;
				case "return":
					metadata.returns = {
						type: args[0].replace(/({|})/g,""),
						description : args.slice(1).join(" ")
					};
					break;
				default:
					console.log("-- WARNING line: ".yellow + ln);
					console.log("   Attribute: ".yellow + attr);
					console.log("   with arguments: ".yellow + args);
					break;
			}
		}else{
			metadata.description += ln.replace(/\* /g, "") + " ";
		}
	});
	return metadata;
}

function docsBuilder(pattern, options){
	var files = [],
		blocks = [],
		docsData = {};

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
		if(meta.class && !docsData[meta.class]){
			docsData[meta.class] = meta;
			docsData[meta.class].methods = [];
			docsData[meta.class].events = [];
			docsData[meta.class].properties = [];
			docsData[meta.class].configs = [];
		}
		if(meta.member && docsData[meta.member]){
			if(meta.method) docsData[meta.member].methods.push(meta);
			if(meta.event) docsData[meta.member].events.push(meta);
			if(meta.property) docsData[meta.member].properties.push(meta);
			if(meta.config) docsData[meta.member].configs.push(meta);
		}
	});

	console.log("========================================================".green);
	console.log("    Building references Complete...");
	console.log("========================================================".green);
	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);

	console.log("========================================================".green);
	console.log("    Writing Files...");
	console.log("========================================================".green);

	var index = templateFn({ data: JSON.stringify(docsData) });
	fs.writeFileSync(__dirname +"/index.html", index);

	console.log("========================================================".green);
	console.log("    Writing Complete...");
	console.log("========================================================".green);
}

module.exports = docsBuilder;