/**
 * Events controller.
 *
 */

dingo.controllers.controller('EventsCtrl', function($scope, Category, Event, User, Util) {

	$scope.category_width = 166;
	$scope.categories = [];
	$scope.events = [];
	$scope.filter = {
		eventsKeyword: "",
		selectedCategories: []
	};
	$scope.lastDate = null;

	$scope.emptyEventsForThisDate = function(eventDate){
		var d = new Date(eventDate).setHours(0,0,0,0);
		if($scope.lastDate == null || $scope.lastDate != d){
			$scope.lastDate = d;
			return true;
		}
		return false;
	};

	$scope.search = function(){
		var eventKeyword = $scope.filter.eventsKeyword;
		var categoryIds = $scope.filter.selectedCategories;
		console.log('searching for ' + eventKeyword + ' in ' + categoryIds.length + ' categories.');
		Event.searchByName({
			"any": false,
			"name": eventKeyword,
			"category_ids[]": categoryIds
		},function(events){
			$scope.events = events;
		});
	};

	$scope.searchEventsByCategories = function(category){
		var i = $scope.filter.selectedCategories.indexOf(category.id);
		if(i == -1){
			$scope.filter.selectedCategories.push(category.id);
		}
		else {
			$scope.filter.selectedCategories.splice(i,1);
		}
		this.search();
	};

	var init = function(){
		console.log('init() - Running Events Controller...');
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
			$scope.categories_width = (($scope.category_width + 5) * categories.length) - 5;
			loaded('categories');
		});
		Event.loadAll(function(events){
			$scope.events = events;
			loaded('events');
		});
	};


	// run on init for every controller
	(function(){
		console.log('Running Events Controller...');
		Util.showLoading();
		if(User.isLogged()){
			init();
		} else {
			User.registerToLoginCallback(init,'EventsCtrl');
		}
	})();



});
