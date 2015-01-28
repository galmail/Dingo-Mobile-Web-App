/**
 * Ticket Details controller.
 *
 */

dingo.controllers.controller('TicketDetailsCtrl', function($scope,$stateParams,Event,Ticket,Payment) {

	$scope.event = {};
	$scope.ticket = {};

	// run on init
	(function(){
		console.log('Running TicketDetailsCtrl...');
		// loading event and ticket details
		var eventId = $stateParams.eventId;
		var ticketId = $stateParams.ticketId;

		Event.getById(eventId,function(event){
			$scope.event = event;
		});
		Ticket.getById(ticketId,function(ticket){
			$scope.ticket = ticket;
		});

	})();


	$scope.buyTicket = function(){
		
		var onSuccesfulPayment = function(payment){
			console.log("payment success: " + JSON.stringify(payment, null, 4));
		};

		var onUserCanceled = function(result){
			console.log('user canceled: ',result);
		};

		if(!Payment.started){
			console.log('payment library has not been set with this device.');
			return false;
		}

		Payment.makePayment({
			amount: Ticket.calculateBuyingPrice($scope.ticket),
			description: 'Ticket(s) for ' + $scope.event.name
		},onSuccesfulPayment,onUserCanceled);

	}




});
