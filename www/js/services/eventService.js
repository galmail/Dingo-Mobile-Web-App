/**
 * Event Service.
 *
 */

dingo.services.factory('Event', function($http, Util) {
  
  return {

    parseEvents: function(events){
      angular.forEach(events, function(event) {
        var now = new Date();
        var d = new Date(event.date);
        if(d.getFullYear() != now.getFullYear()){
          event.parsed_date = moment(d).format('dddd Do MMM YYYY');
        }
        else {
          if(d.getDate() == now.getDate() && d.getMonth() == now.getMonth()){
            event.parsed_date = 'Today';
          }
          else if(d.getDate() == now.getDate()+1 && d.getMonth() == now.getMonth()){
            event.parsed_date = 'Tomorrow';
          }
          else {
            event.parsed_date = moment(d).format('dddd Do MMM');
          }
        }
        event.parsed_time = moment(d).format('h:mm a');
        event.min_price = Math.round(event.min_price);
      });
      return events;
    },

    loadAll: function(callback){
      var self = this;
      $http.get('/api/v1/events').success(function(res){
        var events = self.parseEvents(res.events);
        callback(events);
      });
    },

    getById: function(eventId,callback){
      var self = this;
      $http.get('/api/v1/events?id='+eventId).success(function(res){
        var events = self.parseEvents(res.events);
        callback(events[0]);
      });
    },

    searchByName: function(params,callback){
      var self = this;
      $http.get('/api/v1/events',{
        params: params 
      }).success(function(res){
        var events = self.parseEvents(res.events);
        callback(events);
      });
  	}

  };

});