var docs = require("../../index.js"),
	fs = require('fs'),
	rimraf = require('rimraf').sync,
	firstProcess = process.cwd();

describe("Test docsBuilder", function(){

	afterEach(function(){
		process.chdir(firstProcess);

		if (fs.existsSync("./docs/")){
			rimraf("./docs/");
		}
	});

	it("should be defined", function() {
		expect(docs).toBeDefined();
	});

	it("should build documentation", function() {
		process.chdir(__dirname);
		
		docs("../SomeLibraryTest/**/**.js", { dest: "../../docs/" } );

		expect(fs.existsSync("../../docs/")).toBe(true);
		expect(fs.existsSync("../../docs/css")).toBe(true);
		expect(fs.existsSync("../../docs/css/img")).toBe(true);
		expect(fs.existsSync("../../docs/fonts")).toBe(true);
		expect(fs.existsSync("../../docs/mds")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.chart.SomeChart.html")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.data.SocketsClient.html")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.html")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.Interface.html")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.Object.html")).toBe(true);
		expect(fs.existsSync("../../docs/mds/SomeLibrary.ObjectSingleton.html")).toBe(true);
		expect(fs.existsSync("../../docs/index.html")).toBe(true);

	});
})