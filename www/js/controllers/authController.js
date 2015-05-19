/**
 * Auth controller.
 *
 */

dingo.controllers.controller('AuthCtrl', function($scope, Facebook, $ionicModal, $location, $http, User, Util) {

  // Login with facebook
  $scope.fbLogin = function(){
    Util.showLoading();
    User.fbLogin(function(logged){
      Util.hideLoading();
      if(logged){
        window.history.back();
      }
      else {
        console.log('Something went wrong, user is not logged in.');
      }
    });
  };

  // Login as Guest
  $scope.guestLogin = function(){
    Util.showLoading();
    if (User.isLogged()){
      Util.hideLoading();
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
      Util.hideLoading();
      if(ok){
        window.history.back();
      }
      else {
        console.log('something went wrong, user is not logged in!');
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