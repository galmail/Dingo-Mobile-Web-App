/**
 * Sell Ticket controller.
 *
 */

dingo.controllers.controller('SellTicketCtrl', function($scope, $location, Event, Ticket) {

	$scope.ticketDetails = Ticket.ticketForSale;

	$scope.events = [];

	$scope.filterEvent = function(){
		var self = this;
		if(self.ticketDetails.event.name.length>0) {
			console.log('filtering event: ' + self.ticketDetails.event.name);
			self.ticketDetails.event.selected = false;
			Event.searchByName(self.ticketDetails.event.name, function(listOfEvents){
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
		this.ticketDetails.event.name = event.name;
		this.ticketDetails.event.location = event.location;
		this.ticketDetails.event.from = event.from;
		this.ticketDetails.event.to = event.to;
		this.ticketDetails.event.selected = true;
		// set location, from, to fields to disabled.
	};

	$scope.previewTicket = function(){
		// TODO: Validate Form
		Ticket.ticketForSale = this.ticketDetails;
		$location.path("/home/sell-ticket-preview");
	};

	$scope.sellTicket = function(){
		alert('Sell Ticket...');
	};
	

});
