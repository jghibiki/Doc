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
	$scope.chk = {
		recent: false,
		related: false,
		relatedToRecent: false
	}
	$scope.showControls = false;
	$scope.playbackState = false;


	/* Queue */

	$scope.updateQueue = function (){
		queue.get(function(response){
			$scope.queue = response.queue;
			$scope.currentlyPlaying = response.current;
		});
	}


	/* Skip Current Song */
	$scope.skipSong = function(){
		playback.skip();
	}


	/* Related */

	$scope.relatedCheckboxClicked = function(){
		playback.setRelated($scope.chk.related, function(resp){
			$scope.chk.related = resp.state;
		});
	}
	
	$scope.updateRelatedCheckbox = function(){
		if($scope.showControls){
			playback.getRelated(function(resp){
				$scope.chk.related = resp.state;
			})
		}
	}

	$scope.clearRecent = function(){
		playback.clearRecentList();
	}


	/* Related To Recent */

	$scope.relatedToRecentCheckboxClicked = function(){
		playback.setRelatedToRecent($scope.chk.relatedToRecent, function(resp){
			$scope.chk.relatedToRecent = resp.state;
		});
	}

	$scope.updateRelatedToRecentCheckbox = function(){
		if($scope.showControls){
			playback.getRelatedToRecent(function(resp){
				$scope.chk.relatedToRecent = resp.state;
			});
		}
	};


	/* Recent */

	$scope.recentCheckboxClicked = function(){
		playback.setRecent($scope.chk.recent, function(resp){
			$scope.recentCheckbox = resp.state;
		});
	};

	$scope.updateRecentCheckbox = function(){
		if($scope.showControls){
			playback.getRecent(function(resp){
				$scope.chk.recent = resp.state;
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

	$scope.updatePlaybackState = function(){
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
		$scope.restUpdate();
	};


	/* UI REST Data Update Timer */

	$scope.restUpdate = function(){
		$scope.updateQueue();
		$scope.updateRelatedCheckbox();
		$scope.updateRelatedToRecentCheckbox();
		$scope.updateRecentCheckbox();
		$scope.updatePlaybackState();
	};

	$scope.restUpdate();
	$scope.updateTimer = setInterval($scope.restUpdate, 10000);

}]);