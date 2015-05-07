/**
 * Settings controller.
 *
 */

dingo.controllers.controller('SettingsCtrl', function($scope, $location, User, Facebook, Util, Payment) {

	$scope.user_data = {};

	$scope.saveSettings = function(){
		User.updateProfile($scope.user_data,function(ok){
			if(ok){
				alert('Settings saved successfully!');
			}
			else {
				alert('Settings were not saved. Please check your connection and try again.');
			}
		});
	};

	$scope.logout = function(){
		User.logout();
		$location.path('/');
	};

  $scope.connectPaypal= function(){
    console.log('connecting paypal...');
    Payment.loginWithPaypal(function(userData){
      if(userData){
        User.setInfo(userData);
        $scope.user_data = User.getInfo();
        alert('Paypal account connected successfully!');
      }
      else {
        alert('Paypal account was not connected!');
      }
    });
  };

  // Connect with facebook
  $scope.connectWithFacebook = function(){
    User.fbLogin(function(logged){
      if(logged){
        $scope.user_data = User.getInfo();
        alert('User is logged in.');
      }
      else {
        alert('User is not logged in.');
      }
    });
  };

  var init = function(){
    console.log('Running Settings Controller...');
    $scope.user_data = User.getInfo();
    Util.hideLoading();
  };


  // run on init for every controller
  (function(){
    Util.showLoading();
    if(User.isLogged()){
      init();
    } else {
      User.registerToLoginCallback(init,'SettingsCtrl');
    }
  })();

  
});
