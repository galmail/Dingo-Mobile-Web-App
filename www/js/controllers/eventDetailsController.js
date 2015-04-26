/**
 * Event Details controller.
 *
 */

dingo.controllers.controller('EventDetailsCtrl', function($scope,$location,$stateParams,Event,Ticket,User,Util) {

	$scope.event = {};
	$scope.tickets = [];

	$scope.go = function(path) {
	  $location.path(path);
	};

	var init = function(){
		console.log('Running EventDetailsCtrl...');
		var allLoaded = { event: false, tickets: false };
		var loaded = function(key){
			allLoaded[key] = true;
			for(obj in allLoaded){
				if(allLoaded[obj]==false) return false;
			}
			// done loading
			Util.hideLoading();
		};

		// loading event
		var eventId = $stateParams.eventId;
		Event.getById(eventId,function(event){
			$scope.event = event;
			loaded('event');
		});
		Ticket.getByEventId(eventId,function(tickets){
			$scope.tickets = tickets;
			loaded('tickets');
		});
	};


	// run on init for every controller
	(function(){
		Util.showLoading();
		if(User.isLogged()){
			init();
		} else {
			User.registerToLoginCallback(init,'EventDetailsCtrl');
		}
	})();

});
