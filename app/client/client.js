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


	/* Definitions */ 

	$scope.queue = [];
	$scope.currentlyPlaying = null;
	$scope.relatedCheckbox = false;
	$scope.recentCheckbox = false;
	$scope.relatedToRecentCheckbox = false;
	$scope.showControls = false;
	$scope.playbackState = false;


	/* Queue */

	function updateQueue(){
		queue.get(function(response){
			if($scope.queue.length != response.length){
				$scope.queue = response.queue;
				$scope.currentlyPlaying = response.current;
			}
		});
	}


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
		if($scope.showControls){
			playback.getRelated(function(resp){
				$scope.relatedCheckbox = resp.state;
			})
		}
	}

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
		if($scope.showControls){
			playback.getRelatedToRecent(function(resp){
				$scope.relatedToRecentCheckbox = resp.state;
			});
		}
	};


	/* Recent */

	$scope.recentCheckboxClicked = function(){
		playback.setRecent($scope.recentCheckbox, function(resp){
			$scope.recentCheckbox = resp.state;
		});
	};

	function updateRecentCheckbox(){
		if($scope.showControls){
			playback.getRecent(function(resp){
				$scope.recentCheckbox = resp.state;
			});
		}
	};


	/* Playback State */

	$scope.playbackStateMessage = function(){
		if($scope.playbackSate){
			return "Plause Playback";
		}
		else{
			return "Resume Playback";
		}
	};

	$scope.playbackStateButtonClicked = function(){
		$scope.playbackSate = !$scope.playbackSate
		playback.setState($scope.playbackSate, function(resp){
			$scope.playbackSate = resp.state;
		});
	};

	function updatePlaybackState(){
		if($scope.showControls){
			playback.getState(function(resp){
				$scope.playbackSate = resp.state;
			})
		}
	};


	/* Search Song */

	$scope.searchSong = function(){
		search($scope.url, function(results){
			$scope.searchResults = results;
		})
	};

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
	};


	/* Hide/Show Controls */

	$scope.toggleControls = function(){
		$scope.showControls = !$scope.showControls;
		RestUpdate();
	};


	/* UI REST Data Update Timer */

	function RestUpdate(){
		updateQueue();
		updateRelatedCheckbox();
		updateRelatedToRecentCheckbox();
		updateRecentCheckbox();
		updatePlaybackState();
	};

	RestUpdate();
	$scope.updateTimer = setInterval(RestUpdate, 10000);

}]);