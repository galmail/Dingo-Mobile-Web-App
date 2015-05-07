/**
 * Sell Ticket controller.
 *
 */

dingo.controllers.controller('SellTicketCtrl', function($scope, $location, Event, Ticket, User, Util) {

	$scope.ticketDetails = null;

	$scope.events = [];

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

	$scope.previewTicket = function(){
		var run = function(){
			Ticket.ticketForSale = this.ticketDetails;
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
