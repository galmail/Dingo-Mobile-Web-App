/**
 * FAQs controller.
 *
 */

dingo.controllers.controller('FAQsCtrl', function($scope,$location,$stateParams) {

	$scope.groups = [
		{
			name: 'dingo question 1',
			item: 'dingo answer 1'
		},
		{
			name: 'dingo question 2',
			item: 'dingo answer 2'
		}
	];
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

	// run on init
	(function(){
		console.log('Running FAQs Controller...');
		var faqId = $stateParams.faqId;
		if(faqId){
			//$location.hash(faqId);





		}
	})();

	$scope.showFAQdetail = function(id){
		$location.path("/app/faq/"+id);
	};



  
});
