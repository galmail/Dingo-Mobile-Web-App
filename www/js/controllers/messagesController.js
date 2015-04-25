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

	$scope.$watch(function () { return Message.active_chat.messages; }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
      if(Message.active_chat.conversation_id) $scope.refreshChat();
    }
	});

	$scope.setActivePeer = function(peer){
		Message.active_chat.peer = peer;
	};

	$scope.refreshChat = function(){
		console.log('refreshing conversation: ' + Message.active_chat.conversation_id);
		$scope.active_peer = Message.active_chat.peer;
		$scope.messages = Message.active_chat.messages;
		var scrollToBottom = function(){ $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(); };
		setTimeout(scrollToBottom,300);
	};

	$scope.sendMessage = function(){
		if($scope.message_to_send.txt=='') return;
		Message.sendMessage($scope.message_to_send.txt,function(){
			$scope.message_to_send.txt = '';
			Message.loadChat();
		});
	};

	var init = function(){
		console.log('Running Messages Controller...');
		$scope.current_user_id = User.getInfo().id;
		Message.active_chat.conversation_id = $stateParams.conversationId;
		if(Message.active_chat.conversation_id){
			Message.loadChat();
		}
		else {
			// get peers
			Message.getPeers(function(peers){
				$scope.peers = peers;
			});
		}
	};


	// run on init for every controller
	(function(){
		if(User.isLogged()) init(); else User.registerToLoginCallback(init,'MessagesCtrl');
	})();


});
