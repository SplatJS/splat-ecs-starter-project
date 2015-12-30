"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Splat = require("splat-ecs");

var animations = require("./data/animations");
var entities = require("./data/entities");

var images = new Splat.ImageLoader();
images.loadFromManifest(require("./data/images"));

var input = require("./data/inputs");

var scenes = require("./data/scenes");

var sounds = new Splat.SoundLoader();
sounds.loadFromManifest(require("./data/sounds"));

var systems = require("./data/systems");

// This is some webpack magic to ensure the dynamically required scripts are loaded

var splatSystemPath = "splat-ecs/lib/systems";
// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
var splatSystemRequire = require.context("splat-ecs/lib/systems", true, /\.js$/);

var localSystemPath = "./systems";
var localSystemRequire = require.context("./systems", true, /\.js$/);

var localScriptPath = "./scripts";
var localScriptRequire = require.context("./scripts", true, /\.js$/);

function customRequire(path) {
	if (path.indexOf(splatSystemPath) === 0) {
		var splatName = "./" + path.substr(splatSystemPath.length + 1) + ".js";
		return splatSystemRequire(splatName);
	}
	if (path.indexOf(localSystemPath) === 0) {
		var localName = "./" + path.substr(localSystemPath.length + 1) + ".js";
		return localSystemRequire(localName);
	}
	if (path.indexOf(localScriptPath) === 0) {
		var scriptName = "./" + path.substr(localScriptPath.length + 1) + ".js";
		return localScriptRequire(scriptName);
	}
	console.error("Unable to load module: \"", path, "\"");
	return undefined;
}
require("./index.html");
require.context("./images", true, /\.(jpe?g|png|gif|svg)$/i);
require.context("./sounds", true, /\.(mp3|ogg|wav)$/i);
var prefabs = require("./data/prefabs");

var prefabs = require("./data/prefabs");

var game = new Splat.Game(canvas, animations, entities, images, input, customRequire, scenes, sounds, systems, prefabs);

function percentLoaded() {
	if (images.totalImages + sounds.totalSounds === 0) {
		return 1;
	}
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, game.scene);
loading.start(context);
