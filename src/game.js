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

// This is some webpack magic to ensure the systems from splat are included in the bundle
var splatSystemPath = "splat-ecs/lib/systems";
// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
var systemRequire = require.context("splat-ecs/lib/systems", true, /\.js$/);
function requireSystem(path) {
	if (path.indexOf(splatSystemPath) === 0) {
		var name = "./" + path.substr(splatSystemPath.length + 1) + ".js";
		return systemRequire(name);
	}
	return require(path);
}

var game = new Splat.Game(canvas, animations, entities, images, input, requireSystem, scenes, sounds, systems);

function percentLoaded() {
	if (images.totalImages + sounds.totalSounds === 0) {
		return 1;
	}
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, game.scene);
loading.start(context);
