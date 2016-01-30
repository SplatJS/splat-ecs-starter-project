"use strict";

var accumulatedTime = 0;
var accumulatedFps = 0;
var accumulatedFrames = 0;

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	ecs.addEach(function logFrameRate(entity, context, elapsed) { // eslint-disable-line no-unused-vars

		accumulatedTime += elapsed;

		var currFps = Math.floor(1000 / elapsed);
		accumulatedFps += currFps;
		accumulatedFrames++;

		if (accumulatedTime > 1000) {
			var spriteCount = game.entities.find("sprite").length;
			console.log(currFps + " FPS, " + (accumulatedFps / accumulatedFrames) + " AVG, " + spriteCount + " sprites");

			accumulatedTime = 0;
			accumulatedFps = 0;
			accumulatedFrames = 0;
		}
	}, "camera");
};
