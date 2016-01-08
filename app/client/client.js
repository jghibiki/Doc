'use strict';

angular.module('doc.client', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/client', {
    templateUrl: 'client/client.html',
    controller: 'ClientCtrl'
  });
  $routeProvider.when('/', {
    templateUrl: 'client/client.html',
    controller: 'ClientCtrl'
  });
}])

.controller('ClientCtrl', ["$scope", "queue", "search", function($scope, queue, search) {
	function updateQueue(){
		queue.get(function(response){
			if($scope.queue.length != response.length){
				$scope.queue = response
			}
		});
	}
	$scope.queue = [];
	$scope.queueTimer = setInterval(updateQueue, 2000);

	$scope.searchSong = function(){
		search($scope.url, function(results){
			$scope.searchResults = results;
		})
	}

	$scope.requestSong = function(ytid){
		for(var i=0; i < $scope.searchResults.length; i++){
			if($scope.searchResults[i].yt === ytid){
				var song = $scope.searchResults[i];
				queue.add({
					url: song.url,
					yt: song.yt,
					title: song.title,
					uploader: song.uploader,
					description: song.description,
					thumbnail: song.thumbnail
				}, function(res){
					updateQueue();
				});
				alert("Song Requested\n" + song.title);
				break;
			}
		}
	}	
}]);