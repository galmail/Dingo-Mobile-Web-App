/**
 * Message Service.
 *
 */

dingo.services.factory('Message', function($http, User) {

  return {

    active_chat: {
      conversation_id: null,
      peer: {},
      messages: []
    },

    getPeers: function(callback){
      $http.get('/api/v1/messages/peers').success(function(peers){
        callback(peers);
      });
    },

    loadChat: function(callback){
      var self = this;
      var conversationId = self.active_chat.conversation_id;
      if(conversationId){
        $http.get('/api/v1/messages?conversationId='+conversationId).success(function(res){
          var messages = res.messages.reverse();
          self.active_chat.messages = messages;
          // mark all messages in the conversation as read
          $http.post('/api/v1/messages/mark_all_as_read',{
            conversation_id: conversationId
          }).success(function(res){
            // update badge icon
            User.setInfo(res);
          });
          if(typeof(callback)=='function') callback();
        });
      }
    },

    sendMessage: function(msg,callback){
      var self = this;
      $http.post('/api/v1/messages',{
        receiver_id: self.active_chat.peer.user_id,
        content: msg
      }).success(callback);
    },

    incomingMsg: function(msgObj){
      var conversation_id = msgObj.conversation_id;
      var content = msgObj.alert;
      if(conversation_id == this.active_chat.conversation_id){
        this.loadChat();
      }
      else {
        User.info.num_unread_messages++;
      }
    }
    

  };

});