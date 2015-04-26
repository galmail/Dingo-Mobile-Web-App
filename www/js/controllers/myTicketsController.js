/**
 * MyTickets controller.
 *
 */

dingo.controllers.controller('MyTicketsCtrl', function($scope,$location,$stateParams,Ticket,Event,User,Util) {

	$scope.tickets = [];
  $scope.currentTicket = null;
  $scope.currentEvent = null;

  $scope.showSellingTickets = function(){
    $location.path("/app/mytickets/selling");
  };

  $scope.showSoldTickets = function(){
    $location.path("/app/mytickets/sold");
  };

  $scope.showPurchasedTickets = function(){
    $location.path("/app/mytickets/purchased");
  };

  $scope.go = function(ticket){
    var ticketId = ticket.id;
    var eventId = ticket.event_id;
    window.location.href += '/' + eventId + '/' + ticketId + '/show';
  };

	var init = function(){
		console.log('Running MyTickets Controller...');
    var ticketsType = $stateParams.ticketsType;
    var eventId = $stateParams.eventId;
    var ticketId = $stateParams.ticketId;
    var allLoaded = {};
    var loaded = function(key){
      allLoaded[key] = true;
      for(obj in allLoaded){
        if(allLoaded[obj]==false) return false;
      }
      // done loading
      Util.hideLoading();
    };
    if(eventId){
      allLoaded.event = false;
      Event.getById(eventId,function(event){
        $scope.currentEvent = event;
        loaded('event');
      });
    }
    if(ticketId){
      allLoaded.ticket = false;
      Ticket.getById(ticketId,function(ticket){
        $scope.currentTicket = ticket;
        loaded('ticket');
      });
    }
    if(ticketsType){
      allLoaded.mytickets = false;
      $scope.ticketsType = ticketsType;
      Ticket.getMyTickets($scope.ticketsType,function(tickets){
        $scope.tickets = tickets;
        loaded('mytickets');
      });
    }
    if(Util.isEmptyObject(allLoaded)){
      Util.hideLoading();
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
