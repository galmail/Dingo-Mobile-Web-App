/**
 * Messages controller.
 *
 */

dingo.controllers.controller('MessagesCtrl', function($scope) {

	$scope.messages = [];

	$scope.conversations = [

		{
			id: '1',
			user_pic: 'http://s3-us-west-2.amazonaws.com/dingoapp-test/events/photos/cfb/873/1e-/thumb/images.jpeg?1424255502',
			user_name: 'Steve',
			event_name: 'Lakers vs Bulls'
		},
		{
			id: '1',
			user_pic: 'http://s3-us-west-2.amazonaws.com/dingoapp-test/events/photos/cfb/873/1e-/thumb/images.jpeg?1424255502',
			user_name: 'Steve',
			event_name: 'Lakers vs Bulls'
		},
		{
			id: '1',
			user_pic: 'http://s3-us-west-2.amazonaws.com/dingoapp-test/events/photos/cfb/873/1e-/thumb/images.jpeg?1424255502',
			user_name: 'Steve',
			event_name: 'Lakers vs Bulls'
		}



	];


	

});
