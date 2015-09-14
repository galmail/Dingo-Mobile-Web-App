# README #

This is the Mobile Web App project for [Dingo](http://dingoapp.co.uk)

The Tech Stack for this project includes:

* Javascript, HTML5 and SASS/SCSS
* Ionic Framework
* Angular JS
* Phonegap/Cordova
* Node JS
* Gulp and Bower

## Getting Started ##

Clone the project and run the following commands:

* npm install -g bower
* npm install -g cordova@4.0.0
* npm install -g gulp
* npm install
* bower install
* cordova platform add android

Then add the following Cordova plugins:

* cordova plugin add org.apache.cordova.device
* cordova plugin add org.apache.cordova.console
* cordova plugin add org.apache.cordova.statusbar
* cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
* cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git
* cordova plugin add https://github.com/phonegap-build/PushPlugin.git
* cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="667287336672842" --variable APP_NAME="Dingo"
* cordova plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker.git
* cordova plugin add com.paypal.cordova.mobilesdk

## Testing Locally ##

Run from the terminal: "npm start"

In a new terminal tab run: "gulp watch" script to autocompile the SASS files.

Open Chrome in new tab: http://localhost:3000

To launch on an Android device, run from the terminal:

* gulp
* cordova build android
* cordova run android

(to run on iOS, just replace "android" for "ios")

## Deployment Steps ##

1. Update the app version in config.xml and change index.html to run in "production". Then run: gulp
2. Generate Private Key: keytool -genkey -v -keystore dingo.keystore -alias Dingo -keyalg RSA -keysize 2048 -validity 10000
3. Compile the app in release mode to obtain an unsigned APK: cordova build android --release
4. Sign the app with the private key: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dingo.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk Dingo
5. To Verify: jarsigner -verify -verbose -certs platforms/android/ant-build/CordovaApp-release-unsigned.apk
6. Align the APK: <path>/adt-bundle-mac-x86_64-20131030/sdk/build-tools/22.0.1/zipalign -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk Dingo.apk
