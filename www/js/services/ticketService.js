/**
 * Ticket Service.
 *
 */

dingo.services.factory('Ticket', function($http, Util) {
  
  return {

    ticketForSale: {
      event: {
        // id: '1',
        // name: 'Super Event 1',
        // location: 'London city',
        // from: '01/02/2015',
        // to: '02/02/2015'
      },
      num_tickets: 1,
      type_of_ticket: 'e-Ticket',
      comments: '',
      payment_methods: {
        paypal: true,
        cash: false
      },
      delivery_methods: {
        in_person: true,
        post: true,
        electronic: true
      },
      // price_per_ticket: 10.0,
      // face_value_per_ticket: 10.0,
      getPaymentMethods: function(){
        return 'Paypal, Cash in Person';
      },
      getDeliveryMethods: function(){
        return 'In Person, Post';
      }
    },

    getByEventId: function(eventId,callback){
      $http.get('/api/v1/tickets?event_id='+eventId).success(function(res){
        var tickets = res.tickets;
        callback(tickets);
      });
    },

    getById: function(ticketId,callback){
      $http.get('/api/v1/tickets?id='+ticketId).success(function(res){
        var ticket = res.tickets[0];
        callback(ticket);
      });
    },

    calculateBuyingPrice: function(ticket){
      var price = parseFloat(ticket.price);
      var dingoCommission = price * 0.10;
      return price + dingoCommission;
    }

  };

});