var executeCommand = require("child_process").exec;
var fs = require("fs");
var handlebars = require("handlebars");
var parseAuthor = require("parse-author");
var path = require("path");
var ncp = require('ncp').ncp;

var packageJson = require("../package.json");
var appMetadata = packageJson.appMetadata;

var outDir = path.resolve(__dirname, "../build/cordova");
var cordovaExecutablePath = path.resolve(__dirname, "../node_modules/cordova/bin/cordova");

if (!appMetadata) {
  console.error("Your package.json does not have a properly formatted 'appMetadata' property. Unable to package cordova app(s)");
} else {
  runChildProcess("npm run build")
    .then(() => createCordovaProject(cordovaExecutablePath, appMetadata.bundleId, appMetadata.appName))
    .then(() => console.log("Project Created"))
    .then(generateConfigXml)
    .then(copyBuild)
    .then(copyIcons)
    .then(() => process.chdir(outDir))
    .then(addPlatforms)
    .then(buildCordova)
    .catch((err) => console.error(err));
}


function runChildProcess(command, failureMessage = "Failed to Run Child Process") {
  return new Promise((resolve, reject) => {
    childProcess = executeCommand(command);
    childProcess.stdout.on('data', function(data) {
      process.stdout.write(data);
    });
    childProcess.stderr.on('data', function(data) {
        process.stderr.write(data);
    });
    childProcess.on('close', function(code, signal) {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`${failureMessage} Result Code ${code}. Signal ${signal}`));
        }
    });
  });
}

function createCordovaProject(cordovaExecutePath, bundleId, appName) {
  var command = `${cordovaExecutePath} create ${outDir} ${bundleId} "${appName}"`;
  var failureMessage = "Failed to Create Cordova Project.";
  return runChildProcess(command, failureMessage);
}

function addPlatforms() {
  var platforms = appMetadata.platforms.join(" ");
  var command = `${cordovaExecutablePath} platform add ${platforms}`;
  var failureMessage = `Failed to add platform ${platforms}`;
  return runChildProcess(command, failureMessage);
}

function copyBuild() {
  return copyRecursive(path.join(__dirname, "../build/html"), path.join(outDir, "www"));
}

function copyIcons() {
  return copyRecursive(path.join(__dirname, "../icons"), path.join(outDir, "res"));
}

function copyRecursive(src, dest) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function buildCordova() {
  var platforms = appMetadata.platforms.join(" ");
  var command = `${cordovaExecutablePath} build --buildConfig=../build.json ${platforms}`;
  var failureMessage = `Failed to build platforms ${platforms}`;
  return runChildProcess(command, failureMessage);
}

function generateConfigXml(data) {
  return readFile(path.join(__dirname, "config.xml"))
    .then(data => {
      var template = handlebars.compile(data);
      var context = {
        author: parseAuthor(packageJson.author),
        description: packageJson.description
      };
      return template(context);
    })
    .then(data => {
      return writeFile(path.join(outDir, "config.xml"), data);
    });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}
