var colors = require('colors'),
	u = require(__dirname + "/../src/utils.js"),
	docs   = require('../index.js'), 
	argv = require('yargs').argv;

// Exit with 0 or 1
var failed = false;
process.once('exit', function(code) {
	if (code === 0 && failed) {
		process.exit(1);
	}
});

var r = [];
u.forOwn(docs.availableReaders, function(rt){
	r.push(rt);
});

var readerAvailables = " - " + r.join("\n - ");

var src = argv._;
if(!src.length){
	console.log("[ERROR] : ".red + "No source files or glob definition.");
	failed = true;
	return;
}

if(!argv.dest){
	console.log("[ERROR] : ".red + "'--dest' option its missing");
	failed = true;
	return;
}

if(argv.readerType && ! docs.availableReaders[argv.readerType]){
	console.log("[ERROR] : ".red + "'--readerType' options available: \n" + readerAvailables);
	failed = true;
	return;
}

docs(src, { dest: argv.dest } );