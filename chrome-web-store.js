var fs = require("fs");
var ncp = require("ncp").ncp;
var process = require("process");
var zipFolder = require('zip-folder');

var packageJson = require("./package.json");

var chromeWebStoreManifest = {
    // ----------------- Required -----------------
    // "app" Used by packaged apps to specify the app's background scripts. Also used by hosted apps to specify the URLs that the app uses.
    "app": {
      // "background" Used by packaged apps to specify the app's background scripts. Also used by hosted apps to specify the URLs that the app uses.
      "background": {
        // Optional
        "scripts": ["background.js"]
      }
    },
    // For Splat purposes this should always be the integer 2 without quotes. More info: https://developer.chrome.com/apps/manifest/manifest_version
    "manifest_version": 2,
    "name": packageJson.name,
    // "version" One to four dot-separated integers identifying the version of this game. Must be between 0 and 65535, inclusive, and non-zero integers can't start with 0. More info: https://developer.chrome.com/apps/manifest/version
    "version": packageJson.version,

    // ----------------- Recommended -----------------
    //"default_locale": "en",
    "description": packageJson.description,
    // "icons" paths to png icons 128, 48, and 16 recommended at minimum. More info: https://developer.chrome.com/apps/manifest/icons
    "icons": packageJson.icons,

    // ----------------- Optional -----------------
    "author": packageJson.author,

    // More information on optional features can be found here: https://developer.chrome.com/apps/manifest
    // "automation": "",
    // "bluetooth": {
    //   "uuids": ["1105", "1006"]
    // },
    // "commands": {""},
    // "current_locale": "",
    // "event_rules": [{""}],
    // "externally_connectable": {
    //   "matches": ["*://*.example.com/*"]
    // },
    // "file_handlers": {""},
    // "file_system_provider_capabilities": {
    //   "configurable": true,
    //   "multiple_mounts": true,
    //   "source": "network"
    // },
    // "import": [{"id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}],
    // "key": "publicKey",
    // "kiosk": {
    //   "required_platform_version": ""
    // },
    // "kiosk_enabled": true,
    // "kiosk_only": true,
    // "kiosk_secondary_apps": "",
    // "minimum_chrome_version": "versionString",
    // "nacl_modules": [""],
    // "oauth2": "",
    // "offline_enabled" Let's users know that game works without internet connection with a lightning bolt icon in the store. Mark false if you have ads or any online features! More info: https://developer.chrome.com/apps/manifest/offline_enabled
    "offline_enabled": packageJson.offlineEnabled
    // "optional_permissions": ["tabs"],
    // "permissions": ["tabs"],
    // "platforms": "",
    // "requirements": {""},
    // "sandbox": [""],
    // "short_name": "Short Name",
    // "signature": "",
    // "sockets": {
    //   "tcp": {
    //     "connect": "*"
    //   },
    //   "udp": {
    //     "send": "*"
    //   }
    // },
    // "storage": {
    //   "managed_schema": "schema.json"
    // },
    // "system_indicator": "",
    // "update_url": "http://path/to/updateInfo.xml",
    // "url_handlers": {""},
    // "usb_printers": {
    //   "filters": [""]
    // },
    // "version_name": "aString",
    // "webview": {""}
};

var backgroundJsCode = "chrome.app.runtime.onLaunched.addListener(function() {"
+"  chrome.app.window.create('index.html', {"
+"    'bounds': " + JSON.stringify(packageJson.gameBounds, null, 2)
+"  });"
+"});";

ncp("build/html", "build/chrome-web-store", function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  fs.writeFile("build/chrome-web-store/background.js", backgroundJsCode, function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    fs.writeFile("build/chrome-web-store/manifest.json", JSON.stringify(chromeWebStoreManifest, null, 2), function(err) {
      if (err) {
        console.error(err);
        process.exit(3);
      }

      zipFolder('build/chrome-web-store', 'build/chrome-web-store-build.zip', function(err) {
          if(err) {
              console.log('Error in zipping Chrome web store Build', err);
          } else {
              console.log('Chrome Web Store Build ready. build/chrome-web-store-build.zip');
          }
      });

    });

  });

});
