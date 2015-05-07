/**
 * Ticket Details controller.
 *
 */

dingo.controllers.controller('TicketDetailsCtrl', function($scope,$stateParams,$location,$ionicPopup,Event,Category,Ticket,Payment,Order,User,Message,Util) {

	$scope.event = {};
	$scope.ticket = {};

	$scope.showLoginWithFB = function(callback){
		// show a dialog
		var confirmPopup = $ionicPopup.confirm({
      title: 'User Login',
      template: 'You are currently logged as guest, please login with your facebook account to continue.'
    });
    confirmPopup.then(function(yes) {
      if(yes){
        User.fbLogin(function(logged){
		      if(logged){
		        callback();
		      }
		      else {
		        alert('User is not logged in.');
		      }
		    });
      }
    });
		return false;
	};


	$scope.buyTicket = function(){
		var self = this;

		var run = function(){
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

		if(User.isGuest()){
			this.showLoginWithFB(run);
		} else {
			run();
		}

	};

	$scope.contactSeller = function(){
		var run = function(){
			var ticketId = $scope.ticket.id;
			var receiverId = $scope.ticket.user_id;
			var conversationId = Message.getNewConversationId(ticketId,receiverId);
			Message.active_chat.peer = {
				id: conversationId,
				user_id: receiverId,
				user_pic: $scope.ticket.user_photo,
				user_name: $scope.ticket.user_name,
				event_name: $scope.event.name
			};
			$location.path("/home/messages/" + conversationId);
		};

		if(User.isGuest()){
			this.showLoginWithFB(run);
		} else {
			run();
		}		
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
			$scope.event.category_image = Category.getImage(event.category_id);
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
