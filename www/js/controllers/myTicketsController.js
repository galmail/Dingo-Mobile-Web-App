/**
 * MyTickets controller.
 *
 */

dingo.controllers.controller('MyTicketsCtrl', function($scope,$location,$stateParams,Ticket,User,Util) {

	$scope.tickets = [];

  $scope.showSellingTickets = function(){
    $location.path("/app/mytickets/selling");
  };

  $scope.showSoldTickets = function(){
    $location.path("/app/mytickets/sold");
  };

  $scope.showPurchasedTickets = function(){
    $location.path("/app/mytickets/purchased");
  };

	var init = function(){
		console.log('Running MyTickets Controller...');
    $scope.ticketsType = $stateParams.ticketsType;
    var loaded = function(){ Util.hideLoading(); };
    if($scope.ticketsType){
      Ticket.getMyTickets($scope.ticketsType,function(tickets){
        $scope.tickets = tickets;
        loaded();
      });
    }
    else {
      loaded();
    }
	};

  // run on init for every controller
  (function(){
    Util.showLoading();
    if(User.isLogged()){
      init();
    } else {
      User.registerToLoginCallback(init,'MyTicketsCtrl');
    }
  })();
  
});
