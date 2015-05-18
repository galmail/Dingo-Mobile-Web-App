/**
 * Ticket Service.
 *
 */

dingo.services.factory('Ticket', function($http, Util, User, Event) {
  
  var defaultTicket = {
    event: {},
    //num_tickets: 1,
    //type_of_ticket: 'e-Ticket',
    comments: '',
    payment_methods: {
      paypal: true,
      cash: false
    },
    delivery_methods: {
      in_person: true,
      post: true,
      electronic: true
    }
    //getDeliveryMethods: function(){ return this.delivery_methods; }
  };

  return {

    ticketForSale: angular.copy(defaultTicket),

    resetTicket: function(){
      this.ticketForSale = angular.copy(defaultTicket);
    },

    getDeliveryMethods: function(delivery_methods){
      if(delivery_methods==null){
        delivery_methods = this.ticketForSale.delivery_methods;
      }
      var res = '';
      if(delivery_methods.in_person){
        if(res.length>0) res+=', ';
        res += 'In Person';
      }
      if(delivery_methods.post){
        if(res.length>0) res+=', ';
        res += 'Post';
      }
      if(delivery_methods.electronic){
        if(res.length>0) res+=', ';
        res += 'Electronic';
      }
      return res;
    },

    getPaymentMethods: function(payment_methods){
      if(payment_methods==null){
        payment_methods = this.ticketForSale.payment_methods;
      }
      var res = '';
      if(payment_methods.paypal){
        if(res.length>0) res+=', ';
        res += 'Paypal';
      }
      if(payment_methods.cash){
        if(res.length>0) res+=', ';
        res += 'Cash in Person';
      }
      return res;
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

    getTotalAmount: function(ticket){
      return parseFloat(ticket.price) * ticket.number_of_tickets;
    },

    getTotalToPay: function(ticket){
      return this.getTotalAmount(ticket) * 1.10;
    },

    saveTicket: function(callback){
      var self = this;
      var run = function(){
        $http.post('/api/v1/tickets',{
          event_id: self.ticketForSale.event.id,
          price: self.ticketForSale.price_per_ticket,
          number_of_tickets: self.ticketForSale.num_tickets,
          face_value_per_ticket: self.ticketForSale.face_value_per_ticket,
          ticket_type: self.ticketForSale.type_of_ticket,
          description: self.ticketForSale.comments,
          delivery_options: self.getDeliveryMethods(),
          payment_options: self.getPaymentMethods()
        }).success(function(res){
          self.ticketForSale = angular.copy(defaultTicket);
          callback(true);
        }).error(function(){
          callback(false);
        });
      };
      if(self.ticketForSale.event.id){
        run();
      }
      else {
        Event.createNewEvent(self.ticketForSale.event,function(id){
          self.ticketForSale.event.id = id;
          run();
        });
      }
    },

    getMyTickets: function(ticketsType,callback){
      var self = this;
      $http.get('/api/v1/tickets?mine=true').success(function(res){
        var tickets = res.tickets;

        if(ticketsType=='Purchased'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id == User.getInfo().id){
              tickets.splice(i, 1);
              i--;
            }
          }
        }
        else if(ticketsType=='Selling'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id != User.getInfo().id){
              tickets.splice(i, 1);
              i--;
            }
            else {
              if(tickets[i].available == false || tickets[i].number_of_tickets == 0){
                tickets.splice(i, 1);
                i--;
              }
            }
          }
        }
        else if(ticketsType=='Sold'){
          // filter tickets
          for (var i=0;i<tickets.length;i++){
            if(tickets[i].user_id != User.getInfo().id){
              tickets.splice(i, 1);
              i--;
            }
            else {
              if(tickets[i].number_of_tickets_sold == 0){
                tickets.splice(i, 1);
                i--;
              }
            }
          }
        }
        else {
          // show all tickets...
        }
        callback(self.parseTickets(tickets));
      });
    },

    deleteTicket: function(ticket,callback){
      $http.put('/api/v1/tickets/'+ticket.id,{
        available: false
      }).success(function(){
        callback();
      });
    },

    editTicket: function(ticket,callback){
      var self = this;
      $http.put('/api/v1/tickets/'+ticket.id,{
        price: ticket.price,
        number_of_tickets: ticket.number_of_tickets,
        face_value_per_ticket: ticket.face_value_per_ticket,
        ticket_type: ticket.ticket_type,
        description: ticket.description,
        delivery_options: self.getDeliveryMethods(ticket.delivery_methods),
      }).success(function(){
        callback();
      });
    },

    parseTicket: function(ticketObj){
      var ticket = ticketObj;
      ticket.price = parseFloat(ticketObj.price);
      ticket.face_value_per_ticket = parseFloat(ticketObj.face_value_per_ticket);
      ticket.number_of_tickets = parseInt(ticketObj.number_of_tickets);
      var deliveryArray = ticketObj.delivery_options.split(',');
      ticket.delivery_methods = {};
      for(var i=0;i<deliveryArray.length;i++){
        var deliveryOption = deliveryArray[i].trim();
        if(deliveryOption=='In Person'){
          deliveryOption = 'in_person';
        }
        else if(deliveryOption=='Electronic'){
          deliveryOption = 'electronic';
        }
        else if(deliveryOption=='Post'){
          deliveryOption = 'post';
        }
        ticket.delivery_methods[deliveryOption] = true;
      }
      return ticket;
    },

    parseTickets: function(tickets){
      angular.forEach(tickets, function(ticket) {
        var d = new Date(ticket.event_date);
        ticket.event_date = moment(d).format('h:mm a, Do MMM');
      });
      return tickets;
    }

  };

});