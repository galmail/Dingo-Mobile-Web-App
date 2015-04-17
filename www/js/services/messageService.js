/**
 * Message Service.
 *
 */

dingo.services.factory('Message', function($http) {

  return {

    getConversations: function(callback){
      $http.get('/api/v1/messages?peers=true').success(function(res){
        var peers = res.peers;
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