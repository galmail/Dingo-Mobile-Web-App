/**
 * Sell Ticket controller.
 *
 */

dingo.controllers.controller('SellTicketCtrl', function($scope, $location, $ionicPopup, Event, Ticket, User, Util) {

	$scope.ticketDetails = null;
	$scope.events = [];

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

	$scope.filterEvent = function(){
		var self = this;
		if(self.ticketDetails.event.name.length>0) {
			console.log('filtering event: ' + self.ticketDetails.event.name);
			self.ticketDetails.event.selected = false;
			Event.searchByName({ name: self.ticketDetails.event.name, any: true }, function(listOfEvents){
				self.events = listOfEvents;
			});
		}
	};

	$scope.showEvent = function(event){
		var thisEvent = event.name.toLowerCase();
		var selectedEvent = this.ticketDetails.event.name.toLowerCase();
		return (thisEvent.indexOf(selectedEvent)>=0 && thisEvent != selectedEvent && selectedEvent.length>0);
	};

	$scope.selectEvent = function(event,events){
		var self = this;
		console.log('selecting event: ' + event.name);
		this.ticketDetails.event.id = event.id;
		this.ticketDetails.event.name = event.name;
		this.ticketDetails.event.address = event.address;
		this.ticketDetails.event.date = new Date(event.date);
		this.ticketDetails.event.end_date = new Date(event.end_date);
		this.ticketDetails.event.selected = true;
	};

	$scope.isValidSellTicketForm = function(){
		var ticket = $scope.ticketDetails;
		var incompleteForm = function(){
			alert('Please complete compulsory fields.');
			return false;
		};
		if(ticket.event.name == null || ticket.event.name==""){
			return incompleteForm();
		}
		if(ticket.event.date == null || ticket.event.date==""){
			return incompleteForm();
		}
		if(ticket.price_per_ticket == null || ticket.price_per_ticket==""){
			return incompleteForm();
		}
		if(ticket.face_value_per_ticket == null || ticket.face_value_per_ticket==""){
			return incompleteForm();
		}
		if(ticket.face_value_per_ticket < ticket.price_per_ticket){
			alert('Tickets on Dingo can only be sold at face value or below. The Dingo Team monitor all listings. Tickets being sold above face value will be removed.');
			return false;
		}
		if(ticket.num_tickets == null || ticket.num_tickets=="" || ticket.num_tickets < 1){
			return incompleteForm();
		}
		if(ticket.type_of_ticket == null || ticket.type_of_ticket==""){
			return incompleteForm();
		}
		if(Ticket.getDeliveryMethods(ticket.delivery_methods) == null || Ticket.getDeliveryMethods(ticket.delivery_methods)==""){
			return incompleteForm();
		}
		return true;
	};

	$scope.previewTicket = function(){
		if(!$scope.isValidSellTicketForm()){
			return false;
		}

		var run = function(){
			Ticket.ticketForSale = $scope.ticketDetails;
			$location.path("/home/sell-ticket-preview");
		};

		if(User.isGuest()){
			this.showLoginWithFB(run);
		} else {
			run();
		}

	};

	$scope.sellTicket = function(){
		Ticket.saveTicket(function(ok){
			if(ok){
				alert('Ticket Created Successfully!');
			}
		});
	};

	var init = function(){
		console.log('init() - Sell Ticket Controller...');
		$scope.ticketDetails = Ticket.ticketForSale;
		$scope.ticketDetails.deliveryMethods = Ticket.getDeliveryMethods();
		Util.hideLoading();
	};

	// run on init for every controller
  (function(){
  	console.log('Running Sell Ticket Controller...');
    Util.showLoading();
    if(User.isLogged()){
      init();
    } else {
      User.registerToLoginCallback(init,'SellTicketCtrl');
    }
  })();	

});
