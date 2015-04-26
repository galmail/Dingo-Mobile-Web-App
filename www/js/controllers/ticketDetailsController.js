/**
 * Ticket Details controller.
 *
 */

dingo.controllers.controller('TicketDetailsCtrl', function($scope,$stateParams,Event,Ticket,Payment,Order,User,Util) {

	$scope.event = {};
	$scope.ticket = {};


	$scope.buyTicket = function(){
		var self = this;
		var description = 'Ticket(s) for ' + self.event.name;

		Order.saveOrder({
			ticket_id: self.ticket.id,
			num_tickets: self.ticket.number_of_tickets,
			amount: Ticket.getTotalAmount(self.ticket)
		},function(){
			Payment.makePayment({
				amount: Ticket.getTotalToPay(self.ticket),
				description: description
			},function(payment){
				Order.approveOrder(payment,function(){
					alert("Payment Success! Redirecting now to a chat screen with the seller...");
				});
			},function(result){
				Order.rejectOrder(function(){
					alert('Payment has been canceled.');
				});
			});
		});
	};





	var init = function(){
		console.log('Running TicketDetailsCtrl...');
		var allLoaded = { event: false, ticket: false };
		var loaded = function(key){
			allLoaded[key] = true;
			for(obj in allLoaded){
				if(allLoaded[obj]==false) return false;
			}
			// done loading
			Util.hideLoading();
		};
		// loading event and ticket details
		var eventId = $stateParams.eventId;
		var ticketId = $stateParams.ticketId;
		Event.getById(eventId,function(event){
			$scope.event = event;
			loaded('event');
		});
		Ticket.getById(ticketId,function(ticket){
			$scope.ticket = ticket;
			loaded('ticket');
		});
	};


	// run on init for every controller
	(function(){
		Util.showLoading();
		if(User.isLogged()){
			init();
		} else {
			User.registerToLoginCallback(init,'TicketDetailsCtrl');
		}
	})();

});
