var glob = require("glob"),
	fs = require('fs'),
	fsSync = require('fs-sync'),
	ncp = require('ncp').ncp,
	rimraf = require('rimraf').sync,
	path = require('path'),
	colors = require('colors'),
	jade = require('jade'),
	namespaces = {},

	//Variables

	hasOwn = {}.hasOwnProperty,

	cssPath 	= __dirname + "/web/css/",
	jsPath 		= __dirname + "/web/js/",
	fontsPath 	= __dirname + "/web/fonts/",
	staging 	= __dirname + "/staging",

	blockRegx = /\/\*\*(.|[\n\r])*?\*\//g,
	lineRegx = /\*[^\/\*]*\b/g,
	docType = /\*\s*@\S*/g;

// Compile a tpl functions
var indexTplFn = jade.compileFile(__dirname + "/web/index.jade", {});
var mdTplFn = jade.compileFile(__dirname + "/web/document.jade", {});

function forEach(list, f) {
	for (var i = 0; i < list.length && !f(list[i], i++);) {
		// empty
	}
}

function forOwn(obj, f) {
	for (var prop in obj) if (hasOwn.call(obj, prop)) {
		if (f(obj[prop], prop)) break;
	}
}

function setNs(name, data){
	var ns = namespaces,
		chunks = name.split("."),
		l = chunks.length;

	forEach(chunks,function(n, i){
		ns[n] = (ns[n] || (i == l-1 ? data : {}));
		ns = ns[n];
	});
}

function parseMenuFromNS(ns){
	var children = [];
	forOwn(ns, function(val, key){
		if(val.$class){
			children.push({
				label: key,
				value: val.$class
			});
		}else{
			children.push({
				label: key,
				children: parseMenuFromNS(val)
			});
		}
	});
	return children;
}

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
				case "member":
				case "method":
				case "extends":
				case "config":
				case "property":
				case "event":
					metadata[attr] = args[0];
					break;
				case "class":
					metadata.$class = args[0];
					break;
				case "private":
				case "protected":
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
		docsData = {},
		autoComplete = [];

	console.log("========================================================".green);
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

	blocks.forEach(function(block){
		var meta = readDocumentationMetadata(block);
		if(meta.$class && !docsData[meta.$class]){
			docsData[meta.$class] = meta;
			docsData[meta.$class].methods = [];
			docsData[meta.$class].events = [];
			docsData[meta.$class].properties = [];
			docsData[meta.$class].configs = [];
			autoComplete.push({
				value: meta.$class,
				type: "class",
				key: meta.$class
			});
		}
		if(meta.member && docsData[meta.member]){
			var row = {
				value: meta.member,
				isPrivate: meta.private,
				isProtected: meta.protected
			};
			if(meta.method){
				row.type = "method";
				row.key = meta.method;
				docsData[meta.member].methods.push(meta);
			}
			if(meta.event){
				row.type = "event";
				row.key = meta.event;
				docsData[meta.member].events.push(meta);
			}
			if(meta.property){
				row.type = "property";
				row.key = meta.property;
				docsData[meta.member].properties.push(meta);
			}
			if(meta.config){
				row.type = "config";
				row.key = meta.config;
				docsData[meta.member].configs.push(meta);
			}
			autoComplete.push(row);
		}
	});

	console.log("    Building references Complete...");
	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);

	console.log("========================================================".green);
	console.log("    Writing Files...");
	console.log("========================================================".green);

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

	forOwn(docsData, function(data, cls){
		setNs(cls, data);
		var md = mdTplFn({ doc: data});
		fs.writeFileSync(staging +"/mds/"+cls+".html", md);
		console.log(' -- Writing Document For: '.green + cls);
	});

	var menuData = parseMenuFromNS(namespaces);

	var index = indexTplFn({ data: JSON.stringify(menuData), autoComplete: JSON.stringify(autoComplete) });
	fs.writeFileSync(staging +"/index.html", index);
	console.log(' -- Writing'.green +' Index: Done!');

	console.log("========================================================".green);
	console.log("    Writing Complete...");
	console.log("========================================================".green);
	console.log("========================================================".green);
}

module.exports = docsBuilder;