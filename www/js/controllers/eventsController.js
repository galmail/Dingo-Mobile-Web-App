/**
 * Events controller.
 *
 */

dingo.controllers.controller('EventsCtrl', function($scope, Category, Event, User, Util) {

	$scope.category_width = 164;
	$scope.categories = [];
	$scope.events = [];

	var init = function(){
		console.log('Running Events Controller...');
		var allLoaded = { categories: false, events: false };
		var loaded = function(key){
			allLoaded[key] = true;
			for(obj in allLoaded){
				if(allLoaded[obj]==false) return false;
			}
			// done loading
			Util.hideLoading();
		};

		Category.loadAll(function(categories){
			$scope.categories = categories;
			$scope.categories_width = ($scope.category_width * categories.length) - 5;
			loaded('categories');
		});
		Event.loadAll(function(events){
			$scope.events = events;
			loaded('events');
		});
	};


	// run on init for every controller
	(function(){
		Util.showLoading();
		if(User.isLogged()){
			init();
		} else {
			User.registerToLoginCallback(init,'EventsCtrl');
		}
	})();



});
