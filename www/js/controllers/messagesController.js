/**
 * Messages controller.
 *
 */

dingo.controllers.controller('MessagesCtrl', function($scope,$stateParams,$ionicScrollDelegate,Message,User,Util) {

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
		if($scope.messages.length != Message.active_chat.messages.length){
			console.log('refreshing conversation: ' + Message.active_chat.conversation_id);
			$scope.active_peer = Message.active_chat.peer;
			$scope.messages = Message.active_chat.messages;
			var scrollToBottom = function(){ $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(); };
			setTimeout(scrollToBottom,300);
		}
	};

	$scope.sendMessage = function(){
		if($scope.message_to_send.txt=='') return;
		Message.sendMessage($scope.message_to_send.txt,function(){
			$scope.message_to_send.txt = '';
			Message.loadChat();
		});
	};

	var init = function(){
		console.log('init() - Running Messages Controller...');
		$scope.current_user_id = User.getInfo().id;
		Message.active_chat.conversation_id = $stateParams.conversationId;
		var loaded = function(){ Util.hideLoading(); };
		if(Message.active_chat.conversation_id){
			$scope.active_peer = Message.active_chat.peer;
			Message.loadChat(loaded);
		}
		else {
			// get peers
			Message.getPeers(function(peers){
				$scope.peers = peers;
				loaded();
			});
		}
	};


	// run on init for every controller
	(function(){
		console.log('Running Messages Controller...');
		Util.showLoading();
		if(User.isLogged()){
			init();
		} else {
			User.registerToLoginCallback(init,'MessagesCtrl');
		}
	})();


});
