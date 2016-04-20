var u = require(__dirname + "/src/utils.js"),
	builder = require(__dirname + "/src/builder.js"),
	jReader = require(__dirname + "/src/javaDocTypeReader.js"),

	globby = require("globby"),
	path = require('path'),
	colors = require('colors'),

	availableReaders = {
		javaDoc : "javaDoc"
	}

	//Variables

	imgCloseFolder	=	"css/img/folder-closed.png",
	imgOpenFolder	=	"css/img/folder-open.png",
	singletonFile	=	"css/img/singleton.png",
	interfaceFile	=	"css/img/file-interface.png";

function setNs(ns, name, data){
	var chunks = name.split("."),
		l = chunks.length,
		lastNs = null;

	u.forEach(chunks,function(n, i){
		ns.nsnodes[n] = (ns.nsnodes[n] || (i == l-1 ? data : {nsnodes:{}}));
		ns = ns.nsnodes[n];
		lastNs = ns;
	});

	if(lastNs && lastNs.$class != data.$class){
		u.assign(lastNs, data);
	}
}

function parseMenuFromNS(ns, id){
	var children = [],
		i = 1;

	u.forOwn(ns.nsnodes || {}, function(val, key){
		if(val.$class){
			var node = {
				id: id + i,
				name: key,
				url: val.$class
			};
			if(val.singleton){
				node.singleton = true;
				node.image = singletonFile;
				if(val.nsnodes){
					node.expanded = false;
					node.children = parseMenuFromNS(val, id + i);
				}
			}
			if(val.interface){
				node.image = interfaceFile;
			}
			children.push(node);
		}else{
			children.push({
				id: id + i,
				image: imgCloseFolder,
				name: key,
				expanded: false,
				children: parseMenuFromNS(val, id + i)
			});
		}
		i++;
	});
	return children;
}

function docsBuilder(pattern, options){
	var files = [],
		blocks = [],
		docsData = {},
		namespaces = {nsnodes:{}},
		autoComplete = [],
		docReader;

	switch(options.readerType){
		case availableReaders.javaDoc:
		default:
			docReader = jReader;
			break;
	}

	console.log("========================================================".green);
	console.log("========================================================".green);
	console.log("    Begin files reading...");
	console.log("========================================================".green);

	globby.sync(pattern, { cwd: options.cwd || process.cwd() }).forEach( function( file ) {
		var fileName = path.resolve(file);
		console.log(" -- Reading: ".green + fileName);
		blocks = blocks.concat(docReader.parseContent(fileName));
	});

	console.log("========================================================".green);
	console.log("    Building references...");
	console.log("    Blocks: " + blocks.length);

	blocks.forEach(function(block){
		var meta = docReader.readDocumentationMetadata(block);
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

	u.forOwn(docsData, function(data, cls){
		setNs(namespaces, cls, data);
	});

	var menuData = parseMenuFromNS(namespaces, "docstree");

	if(menuData.length){
		menuData[0].expanded = true;
		if(!menuData[0].singleton) menuData[0].image = imgOpenFolder;
	}

	console.log("    Building references Complete...");
	console.log("========================================================".green);
	console.log("    Reading Complete...");
	console.log("========================================================".green);

	console.log("========================================================".green);
	console.log("    Writing Files...");
	console.log("========================================================".green);

	builder.write(docsData, menuData, autoComplete, options.dest);

	console.log("========================================================".green);
	console.log("    Writing Complete...");
	console.log("========================================================".green);
	console.log("========================================================".green);
}

docsBuilder.availableReaders = availableReaders;

module.exports = docsBuilder;