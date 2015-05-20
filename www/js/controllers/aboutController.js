/**
 * FAQs controller.
 *
 */

dingo.controllers.controller('AboutCtrl', function($scope) {
	
	$scope.version = null;

	// run on init
	(function(){
		console.log('Running About Controller...');
		if(window.device){
			$scope.version = window.device.appVersion;
		}
		else {
			$scope.version = "1.0.0";
		}
	})();



  
});
