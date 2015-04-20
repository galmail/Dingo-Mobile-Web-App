/**
 * Messages controller.
 *
 */

dingo.controllers.controller('MessagesCtrl', function($scope,$stateParams,Message) {

	$scope.messages = [];
	$scope.peers = [];

	// run on init
	(function(){
		console.log('Running Messages Controller...');
		var conversationId = $stateParams.conversationId;
		if(conversationId){
			// get conversation
		}
		else {
			// get peers
			Message.getPeers(function(peers){
				$scope.peers = peers;
			});
		}


	})();

	

});
