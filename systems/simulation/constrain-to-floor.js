"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
      var floor = 600;
      if (entity.position.y + entity.size.height > floor) {
          entity.position.y = floor - entity.size.height;
          entity.velocity.y = 0;
        }
	}, ["position", "velocity"]);
};
