var fs = require('fs');
var path = require('path');
var file = path.join(__dirname, '/build/html/index.html');
var packageJson = require('./package.json');

fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
    if (err) {
      return console.error(err);
    }
    var newHtml = data
    .replace("{{title}}", packageJson.name)
    .replace("{{description}}", packageJson.description)
    .replace("{{keywords}}", packageJson.keywords.join(", "))
    .replace("{{metaRobots}}", packageJson.metaRobots);

    fs.writeFile(file, newHtml);
});
