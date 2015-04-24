/**
 * Message Service.
 *
 */

dingo.services.factory('Message', function($http, User) {

  return {

    active_peer: {},
    newMessagesCallbacks: { names: [], callbacks: [] },

    //register an observer to incoming messages
    registerToNewMessagesCallback: function(callback,name){
      if(this.newMessagesCallbacks.names.indexOf(name)==-1){
        this.newMessagesCallbacks.callbacks.push(callback);
        this.newMessagesCallbacks.names.push(name);
      }
    },

    notifyNewMessages: function(){
      var self = this;
      angular.forEach(self.newMessagesCallbacks.callbacks, function(callback){
        callback();
      });
    },

    getPeers: function(callback){
      $http.get('/api/v1/messages/peers').success(function(peers){
        callback(peers);
      });
    },

    loadChat: function(conversationId,callback){
      var self = this;
      $http.get('/api/v1/messages?conversationId='+conversationId).success(function(res){
        callback(res.messages.reverse());
        // mark all messages in the conversation as read
        $http.post('/api/v1/messages/mark_all_as_read',{
          conversation_id: conversationId
        }).success(function(res){
          // update badge icon
          User.setInfo(res);
        });
      });
    },

    sendMessage: function(msg,callback){
      var self = this;
      $http.post('/api/v1/messages',{
        receiver_id: self.active_peer.user_id,
        content: msg
      }).success(callback);
    }
    

  };

});