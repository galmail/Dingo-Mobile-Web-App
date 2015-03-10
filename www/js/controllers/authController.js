/**
 * Auth controller.
 *
 */

dingo.controllers.controller('AuthCtrl', function($scope, $ionicModal, $timeout, $http, User, Util, Config) {

  // Login with facebook
  $scope.fbLogin = function(){

    if (window.cordova && window.cordova.platformId == "browser"){
      var fbAppId = Config.FacebookAppId;
      console.log('initiating facebook sdk, fbAppId=' + fbAppId);
      facebookConnectPlugin.browserInit(fbAppId);
    }

    if (!window.facebookConnectPlugin){
      alert('Facebook plugin only works on devices');
    }
    else {
      facebookConnectPlugin.login(["email"],
        function (response){
          console.log('user is connected with facebook!');
          facebookConnectPlugin.api( "me/", ["user_birthday"],
            function (response){
              var userData = User.fbParseUserInfo(response);
              User.setInfo(userData);
              User.connect(function(ok){
                if(ok){
                  alert('User is logged in!');
                }
                else {
                  alert('User is not logged in!');
                }
              });
            }
          );
        },
        function (response){
          //alert(JSON.stringify(response))
          alert('User is not connected with facebook!');
        }
      );
    }
  }

  // Login as Guest
  $scope.guestLogin = function(){
    if (User.isLogged()){
      alert('User is already logged!');
      return;
    }

    var uuid = null;

    if(window.device && window.device.uuid){
      uuid = device.uuid;
    }
    else {
      uuid = Util.generateUUID();
    }
    User.setInfo({ email: uuid+'@guest.dingoapp.co.uk', password: '123456789', name: 'Guest'});
    User.connect(function(ok){
      if(ok){
        alert('user is logged in!');
      }
      else {
        alert('user is not logged in!');
      }
    });
  }

    
}); 