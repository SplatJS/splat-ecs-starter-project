#!/bin/sh
if [ -e cordova-project ]
then
  echo "### Removing Previous Cordova Build"
  rm -rf cordova-project
fi
./node_modules/cordova/bin/cordova create cordova-project com.splatjs.splatEcsStarterProject
cd cordova-project
../node_modules/cordova/bin/cordova platform add android --save
cd ..
npm run build
cd cordova-project
cp -R ../build/html/* www
../node_modules/cordova/bin/cordova build
