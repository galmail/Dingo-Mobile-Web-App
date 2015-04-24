/**
 * Messages controller.
 *
 */

dingo.controllers.controller('MessagesCtrl', function($scope,$stateParams,$ionicScrollDelegate,Message,User) {

	$scope.messages = [];
	$scope.peers = [];
	$scope.current_user_id = null;
	$scope.active_peer = null;
	$scope.message_to_send = { txt: '' };

	$scope.setActivePeer = function(peer){
		Message.active_peer = peer;
	};

	$scope.refreshConversation = function(){
		var conversationId = $stateParams.conversationId;
		if(conversationId){
			console.log('refreshing conversation: '+conversationId);
			$scope.active_peer = Message.active_peer;
			Message.loadChat(conversationId,function(messages){
				$scope.messages = messages;
				var scrollToBottom = function(){ $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(); };
				setTimeout(scrollToBottom,300);
			});
		}
	};

	$scope.sendMessage = function(){
		if($scope.message_to_send.txt=='') return;
		Message.sendMessage($scope.message_to_send.txt,function(){
			$scope.message_to_send.txt = '';
			$scope.refreshConversation();
		});
	};


	var init = function(){
		console.log('Running Messages Controller...');
		$scope.current_user_id = User.getInfo().id;
		var conversationId = $stateParams.conversationId;
		if(conversationId){
			$scope.refreshConversation();
		}
		else {
			// get peers
			Message.getPeers(function(peers){
				$scope.peers = peers;
			});
		}

		Message.registerToNewMessagesCallback($scope.refreshConversation,'MessagesCtrl');

	};


	// run on init for every controller
	(function(){
		if(User.isLogged()) init(); else User.registerToLoginCallback(init,'MessagesCtrl');
	})();


});
