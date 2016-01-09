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

.controller('ClientCtrl', ["$scope", "queue", "search", "playback", function($scope, queue, search, playback) {
	function updateQueue(){
		queue.get(function(response){
			if($scope.queue.length != response.length){
				$scope.queue = response.queue;
				$scope.currentlyPlaying = response.current;
			}
		});
	}
	$scope.queue = [];
	$scope.currentlyPlaying = null;
	$scope.queueTimer = setInterval(updateQueue, 2000);
	$scope.relatedCheckbox = false;
	$scope.recentCheckbox = false;
	$scope.relatedToRecentCheckbox = false;


	/* Skip Current Song */
	$scope.skipSong = function(){
		playback.skip();
	}

	/* Related */

	$scope.relatedCheckboxClicked = function(){
		playback.setRelated($scope.relatedCheckbox, function(resp){
			$scope.relatedCheckbox = resp.state;
		});
	}
	
	function updateRelatedCheckbox(){
		playback.getRelated(function(resp){
			$scope.relatedCheckbox = resp.state;
		})
	}

	updateRelatedCheckbox();
	$scope.updateRelatedCheckboxTimer = setInterval(updateRelatedCheckbox, 10000);

	$scope.clearRelated = function(){
		playback.clearRelatedList();
	}


	/* Related To Recent */

	$scope.relatedToRecentCheckboxClicked = function(){
		playback.setRelatedToRecent($scope.relatedToRecentCheckbox, function(resp){
			$scope.relatedToRecentCheckbox = resp.state;
		});
	}

	function updateRelatedToRecentCheckbox(){
		playback.getRelatedToRecent(function(resp){
			$scope.relatedToRecentCheckbox = resp.state;
		});
	};

	updateRelatedToRecentCheckbox();
	$scope.updateRelatedToRecentCheckboxTimer = setInterval(updateRelatedToRecentCheckbox, 10000);



	/* Recent */

	$scope.recentCheckboxClicked = function(){
		playback.setRecent($scope.recentCheckbox, function(resp){
			$scope.recentCheckbox = resp.state;
		});
	}

	function updateRecentCheckbox(){
		playback.getRecent(function(resp){
			$scope.recentCheckbox = resp.state;
		});
	}

	updateRelatedCheckbox();
	$scope.updateRecentCheckboxTimer = setInterval(updateRelatedCheckbox, 10000);


	/* Search Song */

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