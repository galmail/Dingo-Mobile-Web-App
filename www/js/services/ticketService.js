/**
 * Ticket Service.
 *
 */

dingo.services.factory('Ticket', function($http, Util, User) {
  
  var defaultTicket = {
    event: {},
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
      var res = '';
      if(this.payment_methods.paypal){
        if(res.length>0) res+=', ';
        res += 'Paypal';
      }
      if(this.payment_methods.cash){
        if(res.length>0) res+=', ';
        res += 'Cash in Person';
      }
      return res;
    },
    getDeliveryMethods: function(){
      var res = '';
      if(this.delivery_methods.in_person){
        if(res.length>0) res+=', ';
        res += 'In Person';
      }
      if(this.delivery_methods.post){
        if(res.length>0) res+=', ';
        res += 'Post';
      }
      if(this.delivery_methods.electronic){
        if(res.length>0) res+=', ';
        res += 'Electronic';
      }
      return res;
    }
  };

  return {

    ticketForSale: angular.copy(defaultTicket),

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

    getTotalAmount: function(ticket){
      return parseFloat(ticket.price) * ticket.number_of_tickets;
    },

    getTotalToPay: function(ticket){
      return this.getTotalAmount(ticket) * 1.10;
    },

    saveTicket: function(callback){
      $http.post('/api/v1/tickets',{
        event_id: this.ticketForSale.event.id,
        price: this.ticketForSale.price_per_ticket,
        number_of_tickets: this.ticketForSale.num_tickets,
        face_value_per_ticket: this.ticketForSale.face_value_per_ticket,
        ticket_type: this.ticketForSale.type_of_ticket,
        description: this.ticketForSale.comments,
        delivery_options: this.ticketForSale.getDeliveryMethods(),
        payment_options: this.ticketForSale.getPaymentMethods()
      }).success(function(res){
        this.ticketForSale = angular.copy(defaultTicket);
        callback(true);
      });
    },

    getMyTickets: function(ticketsType,callback){
      $http.get('/api/v1/tickets?mine=true').success(function(res){
        var tickets = res.tickets;

        if(ticketsType=='purchased'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id == User.getInfo().id){
              tickets.splice(i, 1);
            }
          }
        }
        else if(ticketsType=='selling'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id != User.getInfo().id){
              tickets.splice(i, 1);
            }
            else {
              if(tickets[i].available == false || tickets[i].number_of_tickets == 0){
                tickets.splice(i, 1);
              }
            }
          }
        }
        else if(ticketsType=='sold'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id != User.getInfo().id){
              tickets.splice(i, 1);
            }
            else {
              if(tickets[i].number_of_tickets_sold == 0){
                tickets.splice(i, 1);
              }
            }
          }
        }
        else {
          // show all tickets...
        }
        callback(tickets);
      });
    },

    deleteTicket: function(ticket,callback){
      $http.put('/api/v1/tickets/'+ticket.id,{
        available: false
      }).success(function(){
        callback();
      });
    }

  };

});