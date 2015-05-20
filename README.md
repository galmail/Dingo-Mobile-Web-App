# README #

This is the Mobile Web App project for [Dingo](http://dingoapp.co.uk)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions


Installation Steps
================

npm install -g bower
npm install -g cordova@4.0.0
npm install -g gulp
npm install
bower install
cordova platform add android

List of Plugins
================

cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.console
cordova plugin add org.apache.cordova.statusbar
cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="667287336672842" --variable APP_NAME="Dingo"
cordova plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker.git
cordova plugin add com.paypal.cordova.mobilesdk

Test on the Browser
====================

npm start
Open a new tab (Ctrl+T) and run: "gulp watch"

Launch on Device
=================

gulp
cordova build android
cordova run android

Deployment Steps
=================

1. Make sure all config file is set to "production" and the app version is correct.

2. Generate Private Key:

keytool -genkey -v -keystore dingo.keystore -alias Dingo -keyalg RSA -keysize 2048 -validity 10000

3. Compile the app in release mode to obtain an unsigned APK:

cordova build android --release

4. Sign the app with the private key:

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dingo.keystore Dingo.apk Dingo

5. Verify

jarsigner -verify -verbose -certs Dingo.apk

6. Align the APK

zipalign -v 4 your_project_name-unaligned.apk your_project_name.apk








