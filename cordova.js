var executeCommand = require("child_process").exec;
var path = require("path");
var ncp = require('ncp').ncp;

var appMetadata = require("./package.json").appMetadata;

var outDir = "cordova";
var cordovaExecutablePath = path.resolve(__dirname, "./node_modules/cordova/bin/cordova");    

if(!appMetadata){
  console.error("Your package.json does not have a properly formatted 'appMetadata' property. Unable to package cordova app(s)");
}else{  
    createCordovaProject(cordovaExecutablePath, appMetadata.bundleId, appMetadata.appName)
    .then((success) => console.log("Project Created"))
    .then(() => process.chdir(`./${outDir}`))
    .then(addPlatforms)
    .then(() => process.chdir("../"))
    .then(() => runChildProcess("npm run build"))
    .then(copyBuild)
    .then(() => process.chdir(`${outDir}`))
    .then(buildCordova)       
    .catch((err) => console.error(err));
}


function runChildProcess(command, failureMessage = "Failed to Run Child Process"){
  return new Promise((resolve, reject) => {             
    childProcess = executeCommand(command);
    childProcess.stdout.on('data', function(data) {
      process.stdout.write(data);
    });
    childProcess.stderr.on('data', function(data) {
        process.stderr.write(data);
    });
    childProcess.on('close', function(code, signal) {        
        if(code === 0){
          resolve(true);
        }else{
          reject(new Error(`${failureMessage} Result Code ${code}. Signal ${signal}`));
        }
    });
  });
}

function createCordovaProject(cordovaExecutePath, bundleId, appName){
  var command = `${cordovaExecutePath} create ${outDir} ${bundleId} "${appName}"`;
  var failureMessage = "Failed to Create Cordova Project.";
  return runChildProcess(command, failureMessage);           
}

function addPlatforms(){
  var platforms = appMetadata.platforms.join(" ");
  var command = `${cordovaExecutablePath} platform add ${platforms}`;
  var failureMessage = `Failed to add platform ${platforms}`;
  return runChildProcess(command, failureMessage);
}

function copyBuild(){
  return new Promise((resolve, reject) => {

    ncp("./build/html", `./${outDir}/www`, (err) => {
      if(err){
        reject(err);
      }
      resolve(true);
    });
  });
}

function buildCordova(){
  var platforms = appMetadata.platforms.join(" ");
  var command = `${cordovaExecutablePath} build ${platforms}`;
  var failureMessage = `Failed to build platforms ${platforms}`;
  return runChildProcess(command, failureMessage);
}
