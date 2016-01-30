"use strict";

var canvas = document.getElementById("canvas");
var Splat = require("splat-ecs");

// This is some webpack magic to ensure the dynamically required scripts are loaded
var splatSystemPath = "splat-ecs/lib/systems";
// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
var splatSystemRequire = require.context("splat-ecs/lib/systems", true, /\.js$/);
var localRequire = require.context(".", true, /\.(js|json|glsl|fs|vs)$/);

function customRequire(path) {
	if (path.indexOf(splatSystemPath) === 0) {
		var splatName = "./" + path.substr(splatSystemPath.length + 1) + ".js";
		return splatSystemRequire(splatName);
	}
	var extensions = [".js", ".json", ".glsl"];
	var name = path;
	while (localRequire.keys().indexOf(name) === -1) {
		if (extensions.length === 0) {
			return localRequire(path);
		}
		name = path + extensions.shift();
	}
	return localRequire(name);
}
require("./index.html");
require.context("./images", true, /\.(jpe?g|png|gif|svg)$/i);
require.context("./textures", true, /\.(jpe?g|png|gif|svg)$/i);
require.context("./sounds", true, /\.(mp3|ogg|wav)$/i);

new Splat.Game(canvas, customRequire);
