var builder = require("../../src/builder.js"),
	fs = require('fs'),
	rimraf = require('rimraf').sync,
	firstProcess = process.cwd();

describe("Test builder cmp", function(){

	afterEach(function(){
		process.chdir(firstProcess);

		if (fs.existsSync("./docs/")){
			rimraf("./docs/");
		}
	});

	it("should be defined", function() {
		expect(builder).toBeDefined();
	});

	it("should write the default files", function() {
		process.chdir(__dirname);
		
		builder.write( {}, {}, [], "../../docs/");

		expect(fs.existsSync("../../docs/")).toBe(true);
		expect(fs.existsSync("../../docs/css")).toBe(true);
		expect(fs.existsSync("../../docs/css/img")).toBe(true);
		expect(fs.existsSync("../../docs/fonts")).toBe(true);
		expect(fs.existsSync("../../docs/index.html")).toBe(true);

	});
})