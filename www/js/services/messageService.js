/**
 * Message Service.
 *
 */

dingo.services.factory('Message', function($http) {

  return {

    getPeers: function(callback){
      $http.get('/api/v1/messages/peers').success(function(peers){
        callback(peers);
      });
    },

    loadChat: function(conversationId,callback){
      $http.get('/api/v1/messages?conversationId='+conversationId).success(function(res){
        var messages = res.messages;
        callback(messages);
      });
    }
    

  };

});