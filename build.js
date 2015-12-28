var browserify = require("browserify");
var fs = require("fs");
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;
var path = require("path");

var b = browserify();
b.add("./src/game.js");

function srcPath(gamePath) {
	// return gamePath;
	return "." + path.sep + path.join("src", gamePath);
}

function endsWith(str, suffix) {
	return str.substr(str.length - suffix.length) === suffix;
}
function removeSuffix(str, suffix) {
	return str.substr(0, str.length - suffix.length);
}

fs.readdirSync("src/scripts").forEach(function(script) {
	if (endsWith(script, ".js")) {
		b.require("./src/scripts/" + script, { expose: "./scripts/" + removeSuffix(script, ".js") });
	}
});

var systems = require("./src/data/systems");
systems.simulation.forEach(function(system) {
	if (system.name.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(srcPath(system.name), { expose: system.name });
});
systems.renderer.forEach(function(system) {
	if (system.name.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(srcPath(system.name), { expose: system.name });
});

mkdirp.sync("build");
var out = fs.createWriteStream("./build/index.js");
b.bundle().pipe(out);

ncp("src/index.html", "build/index.html");
ncp("src/images", "build/images");
ncp("src/sounds", "build/sounds");
