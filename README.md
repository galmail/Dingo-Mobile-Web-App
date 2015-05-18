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

Test on the Browser
====================

npm start
Open a new tab (Ctrl+T) and run: "gulp watch"

Launch on Device
=================

gulp
cordova build android
cordova run android
