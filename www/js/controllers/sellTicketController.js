/**
 * Sell Ticket controller.
 *
 */

dingo.controllers.controller('SellTicketCtrl', function($scope, $cordovaDatePicker, $filter, $location, $ionicPopup, Event, Ticket, User, Util) {

	$scope.ticketDetails = null;
	$scope.events = [];

	$scope.showDatePicker = function(disabled){
		if(disabled) return false;

		var defaultOptions = {
			date: new Date(),
	    mode: 'date', // or 'time'
	    minDate: new Date() - 10000,
	    allowOldDates: true,
	    allowFutureDates: false,
	    doneButtonLabel: 'DONE',
	    doneButtonColor: '#F2F3F4',
	    cancelButtonLabel: 'CANCEL',
	    cancelButtonColor: '#000000'
		};
		
		var dateOptions = {
			date: new Date(),
	    mode: 'date',
	    minDate: new Date() - 10000,
	    allowOldDates: true,
	    allowFutureDates: false
		};

		var timeOptions = {
			date: new Date(),
	    mode: 'time',
	    minuteInterval: 15
		};

		$cordovaDatePicker.show(dateOptions).then(function(date){
      if(!date) return false;
      $cordovaDatePicker.show(timeOptions).then(function(time){
      	if(!time) return false;
      	var yyyy = date.getUTCFullYear();
      	var mm = date.getUTCMonth()+1;
      	var dd = date.getUTCDate()+1;
      	var h = time.getHours();
				var m = time.getMinutes();
				var datetime = yyyy+'-'+mm+'-'+dd+' '+h+':'+m;
      	$scope.ticketDetails.event.date = new Date(datetime);
      	$scope.ticketDetails.event.formattedDate = $filter('date')(new Date(datetime), 'HH:mm - dd/MM/yyyy');
				$scope.ticketDetails.event.id = null;
      	$scope.ticketDetails.event.selected = true;
      });
    });
	};

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

	$scope.startFiltering = function(){
		$scope.ticketDetails.event.name = "";
		$scope.filterEvent();
	};

	$scope.filterEvent = function(){
		console.log('filtering event: ' + $scope.ticketDetails.event.name);
		$scope.ticketDetails.event.selected = false;
		var searchParams = { any: true };
		if($scope.ticketDetails.event.name.length>0){
			searchParams.name = $scope.ticketDetails.event.name;
		}
		Event.searchByName(searchParams, function(listOfEvents){
			$scope.events = listOfEvents;
		});
	};

	$scope.showEvent = function(event){
		var thisEvent = event.name.toLowerCase();
		var selectedEvent = $scope.ticketDetails.event.name.toLowerCase();
		if(selectedEvent=="") return true;
		return (thisEvent.indexOf(selectedEvent)>=0 && thisEvent != selectedEvent && selectedEvent.length>0);
	};

	$scope.selectEvent = function(event,events){
		console.log('selecting event: ' + event.name);
		$scope.ticketDetails.event.id = event.id;
		$scope.ticketDetails.event.name = event.name;
		$scope.ticketDetails.event.address = event.address;
		$scope.ticketDetails.event.date = new Date(event.date);
		$scope.ticketDetails.event.formattedDate = $filter('date')(new Date(event.date), 'HH:mm - dd/MM/yyyy');
		$scope.ticketDetails.event.end_date = new Date(event.end_date);
		$scope.ticketDetails.event.selected = true;
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
			$scope.showLoginWithFB(run);
		} else {
			run();
		}

	};

	$scope.sellTicket = function(){
		Ticket.saveTicket(function(ok){
			if(ok){
				alert('Ticket Created Successfully! Your ticket will be listed shortly.');
				Ticket.resetTicket();
				$location.path('/');
			}
			else {
				alert('Something went wrong while creating the ticket, please try again later.');
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
