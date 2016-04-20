var fs = require('fs'),

	//Variables

	blockRegx = /\/\*\*(.|[\n\r])*?\*\//g,
	lineRegx = /\*[^\/\*]*\b/g,
	docType = /\*\s*@\S*/g;


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
				case "interface":
					metadata.$class = args[0];
					metadata.interface = true;
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

module.exports = {
	parseContent: parseContent,
	readDocumentationMetadata: readDocumentationMetadata
}