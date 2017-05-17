# Install Oracle Java 8

http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
unzip and add bin folder to $PATH

# Install Android SDK Tools

"just the command line tools"
https://developer.android.com/studio/index.html#command-tools

extract to empty folder
set ANDROID_HOME to empty folder
add `tools/bin` to $PATH

`sdkmanager --update`
`sdkmanager "build-tools;25.0.3"`
`sdkmanager "platforms;android-23"`
`sdkmanager "extras;android;m2repository"`

add `platform-tools` to $PATH

install android studio
ln -s ~/packages/android-studio/plugins/android/lib/templates tools/

chmod a+x tools/templates/gradle/wrapper/gradlew




# OSX

Install Android Studio

Set ANDROID_HOME to
/Users/$USER/Library/Android/sdk

Add
/Users/$USER/Library/Android/sdk/tools/bin
/Users/$USER/Library/Android/sdk/platform-tools
to $PATH

ln -s /Applications/Android Studio.app/Contents/plugins/android/lib/templates tools/


http://stackoverflow.com/questions/39501020/code-sign-error-on-xcode-8-and-ios-10-cordova-project

Get team id
Make build.json
cordova build --buildConfig=build.json ios

open xcode, change device to actual device
click "register now" button under "signing"

cordova run --buildConfig=build.json ios --device


need
1. apple developer account
2. app id / bundle id
3. provisioning profile
4. signing certificate (production / development)

