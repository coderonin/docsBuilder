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

function isObject(object) {
    return object && type.call(object) === "[object Object]";
}

function assign(object, config, defaults, ignoreNulls) {
    if (defaults) {
        assign(object, defaults, null, ignoreNulls);
    }

    if (isObject(object) && isObject(config)) {
        forOwn(config, function (val, prop) {
            if (!ignoreNulls || (ignoreNulls && val != null)) {
                object[prop] = val;
            }
        });
    }

    return object;
}

var hasOwn = {}.hasOwnProperty,
	type = {}.toString;

module.exports = {
	forEach: forEach,
	forOwn: forOwn,
	isObject: isObject,
	assign: assign,
	hasOwn: hasOwn,
	type: type
};