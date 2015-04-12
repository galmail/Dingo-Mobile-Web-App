/**
 * MyTickets controller.
 *
 */

dingo.controllers.controller('MyTicketsCtrl', function($scope,$location,$stateParams,Ticket) {

	$scope.tickets = [];

	// run on init
	(function(){
		console.log('Running MyTickets Controller...');
    $scope.ticketsType = $stateParams.ticketsType;
    if($scope.ticketsType){
      Ticket.getMyTickets($scope.ticketsType,function(tickets){
        $scope.tickets = tickets;
      });
    }
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
  
});
