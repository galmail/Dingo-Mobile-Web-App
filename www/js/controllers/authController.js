/**
 * Auth controller.
 *
 */

dingo.controllers.controller('AuthCtrl', function($scope, Facebook, $ionicModal, $location, $http, User, Util) {

  // Login with facebook
  $scope.fbLogin = function(){
    User.fbLogin(function(logged){
      if(logged){
        window.history.back();
      }
      else {
        alert('User is not logged in.');
      }
    });
  };

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
    User.setInfo({ email: uuid+'@guest.dingoapp.co.uk', password: '123456789', name: 'Guest' });
    User.connect(function(ok){
      if(ok){
        alert('user is logged in!');
        window.history.back();
      }
      else {
        alert('user is not logged in!');
      }
    });
  };

  // run on init
  (function(){
    Util.hideLoading();
    if(User.isLogged()){
      window.history.back();
    }
  })();

    
}); 