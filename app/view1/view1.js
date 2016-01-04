'use strict';

angular.module('doc.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope", "queue", function($scope, queue) {
	function updateQueue(){
		queue.get(function(response){
			$scope.queue = response
		});
	}

	updateQueue();

	$scope.submitRequest = function(){
		queue.add({
			url: $scope.url,
			title: $scope.title,
			uploader: "",
			description: "",
			thumbnail: ""
		}, function(res){
			updateQueue();
		});
	}	
}]);