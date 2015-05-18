/**
 * Home controller.
 *
 */

dingo.controllers.controller('HomeCtrl', function($scope, $http, $location, User, Push, Message) {

	$scope.$watch(function () { return User.info.num_unread_messages; }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
      $scope.num_unread_messages = User.info.num_unread_messages;
    }
	});

	$scope.onTabSelected = function(tab){
		$location.path(tab.href);
	};


	// run on init
	(function(){
		console.log('Running Home Controller...');

		if(!User.isLogged()){
			if(localStorage.getItem('email')!=null && localStorage.getItem('auth_token')!=null){
				User.setInfo({
					email: localStorage.getItem('email'),
					auth_token: localStorage.getItem('auth_token')
				});
				User.login(function(ok){
					if(!ok){
						$location.path("/app/login");
					}
				});
			}
			else {
				$location.path("/app/login");
			}
		}

		User.registerToLoginCallback(function(){
			console.log('registering device');
			// register device
			setTimeout(function(){ Push.register(); }, 3000);
		},'HomeCtrl');

	})();
  
});
