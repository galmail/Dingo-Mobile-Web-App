/**
 * MyTickets controller.
 *
 */

dingo.controllers.controller('MyTicketsCtrl', function($scope,$location,$stateParams) {

	$scope.mytickets = {};

	// run on init
	(function(){
		console.log('Running MyTickets Controller...');
		$scope.ticketsType = $stateParams.ticketsType;
	})();

  $scope.showSellingTickets = function(){
    $location.path("/app/mytickets/selling");
  };

  $scope.showSoldTickets = function(){
    $location.path("/app/mytickets/sold");
  };

  $scope.showPurchasedTickets = function(){
    $location.path("/app/mytickets/purchased");
  };

	$scope.loadTickets = function(){
		
	};

  
});
