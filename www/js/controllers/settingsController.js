/**
 * Settings controller.
 *
 */

dingo.controllers.controller('SettingsCtrl', function($scope, $location, User) {

	$scope.user_data = {};

	// run on init
	(function(){
		console.log('Running Settings Controller...');
		$scope.user_data = User.getInfo();
	})();

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

	$scope.connectWithFacebook = function(){
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
          facebookConnectPlugin.api( "me/", [],
            function (response){
              var userData = User.fbParseUserInfo(response);
              angular.extend($scope.user_data, userData);
              User.setInfo($scope.user_data);
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



  
});
