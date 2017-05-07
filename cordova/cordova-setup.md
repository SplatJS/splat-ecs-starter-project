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

chmod a+x tool s/templates/gradle/wrapper/gradlew
