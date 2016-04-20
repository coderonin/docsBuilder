var utils = require("../../src/utils.js");

describe("Test utilities", function(){

	it("should be defined", function() {
		expect(utils.forEach).toBeDefined();
		expect(utils.forOwn).toBeDefined();
		expect(utils.isObject).toBeDefined();
		expect(utils.assign).toBeDefined();
		expect(utils.hasOwn).toBeDefined();
		expect(utils.type).toBeDefined();
	});

	it("should do a for each", function() {
		var names = [ "paco", "hugo", "luis" ],
			result = "It's me";

		utils.forEach(names, function(n){
			result += " and " + n;
		});

		expect(result).toEqual("It's me and paco and hugo and luis");
	});

	it("should do a for own", function() {
		var names = {
			paco : true,
			hugo: true,
			luis: true
		},
		result = "It's me";

		utils.forOwn(names, function(val, key){
			result += " and " + key;
		});

		expect(result).toEqual("It's me and paco and hugo and luis");
	});

	it("should check type of object", function() {
		var names = {
			paco : true,
			hugo: true,
			luis: true
		};

		expect(utils.type.call(names)).toBe("[object Object]");
	});

	it("should check isObject", function() {
		var names = {
			paco : true,
			hugo: true,
			luis: true
		};

		expect(utils.isObject(names)).toBe(true);
	});

	it("should check if object has own property", function() {
		var names = {
			paco : true,
			hugo: true,
			luis: true
		};

		expect(utils.hasOwn.call(names, "paco")).toBe(true);
	});

	it("should assing values to an object", function() {
		var names = {
			paco : true,
			hugo: true,
			luis: true
		};

		var newNames = utils.assign(names, { donald: false })

		expect(utils.hasOwn.call(newNames, "donald")).toBe(true);
		expect(names.donald).toBe(false);
	});
})