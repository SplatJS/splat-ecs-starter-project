"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
        entity.velocity.y += 0.01;
	}, ["velocity"]);
};
