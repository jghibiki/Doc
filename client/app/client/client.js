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

.controller('ClientCtrl', ["$scope", function($scope ) {


	/* Definitions */ 

	$scope.queue = [];
    $scope.volume = 0;
    $scope.mute = false;
	$scope.currentlyPlaying = null;
    $scope.currentlyPlayingAuto = false;
	$scope.chk = {
		recent: false,
		related: false,
		relatedToRecent: false
	}
	$scope.showControls = false;
	$scope.playbackState = false;
	$scope.magicModeState = false;
	$scope.playbackStateIcon = "play";
	$scope.playbackStateMessage = "Resume Playback";
	$scope.playbackMaxLengthState = true;
	$scope.magicModeState = false;

	/* Skip Current Song */
	$scope.skipSong = function(){
		playback.skip();
	}


	/* Related */

	$scope.relatedCheckboxClicked = function(){
		playback.setRelated($scope.chk.related, function(resp){
			$scope.chk.related = resp.state;
			$scope.updateMagicModeState();
		});
	}
	
	$scope.updateRelatedCheckbox = function(){
		playback.getRelated(function(resp){
			$scope.chk.related = resp.state;
		})
	}

	$scope.clearRecent = function(){
		playback.clearRecentList();
	}


	/* Related To Recent */

	$scope.relatedToRecentCheckboxClicked = function(){
		playback.setRelatedToRecent($scope.chk.relatedToRecent, function(resp){
			$scope.chk.relatedToRecent = resp.state;
			$scope.updateMagicModeState();
		});
	}

	$scope.updateRelatedToRecentCheckbox = function(){
		playback.getRelatedToRecent(function(resp){
			$scope.chk.relatedToRecent = resp.state;
		});
	};


	/* Recent */

	$scope.recentCheckboxClicked = function(){
		playback.setRecent($scope.chk.recent, function(resp){
			$scope.recentCheckbox = resp.state;
		});
	};

	$scope.updateRecentCheckbox = function(){
		playback.getRecent(function(resp){
			$scope.chk.recent = resp.state;
		});
	};


	/* Playback State */

	$scope.playbackStateButtonClicked = function(){
		$scope.playbackState = !$scope.playbackState
		playback.setState($scope.playbackState, function(resp){
			$scope.playbackState = resp.state;

			if($scope.playbackState){
				$scope.playbackStateIcon = "pause";
				$scope.playbackStateMessage = "Pause Playback";
			}
			else{
				$scope.playbackStateIcon = "play";
				$scope.playbackStateMessage = "Resume Playback";
			}
		});
	};

	$scope.updatePlaybackState = function(){
		playback.getState(function(resp){
			$scope.playbackState = resp.state;

			if($scope.playbackState){
				$scope.playbackStateIcon = "pause";
				$scope.playbackStateMessage = "Pause Playback";
			}
			else{
				$scope.playbackStateIcon = "play";
				$scope.playbackStateMessage = "Resume Playback";
			}
		})
	};


	/* Search Song */

	$scope.searchSong = function(){
        client.send({
            type: "command",
            key: "get.search",
            details: {
                query: $scope.url
            }
        })
    };

    client.subscribe("get.search", function(results){
        $scope.searchResults = results.payload;
        $scope.$apply();
    });

    $scope.requestSong = function(ytid){

        for(var i=0; i < $scope.searchResults.length; i++){
            if($scope.searchResults[i].id === ytid){
                var song = $scope.searchResults[i];
                client.send({
                    type: "command",
                    key: "add.queue", 
                    details: {
                        id: song.id,
                    }
                }, true);
                break;
            }
        }
    }

    $scope.clearSearch = function(){
        $scope.searchResults = [];
    }

    /* TODO REPLACE
    client.subscribe("add.queue", function(song){
        alert("Song Requested\n" + song.title);
    });
    */


    client.subscribe("get.queue", function(data){
        $scope.queue = data.payload;
        $scope.$apply();
        /*
         * TODO UPDATE TO get current and autoqueue status
        $scope.currentlyPlaying = queue.current;
        $scope.currentlyPlayingAuto = queue.auto;

        */
    });

	/* Hide/Show Controls */

	$scope.toggleControls = function(){
		$scope.showControls = !$scope.showControls;
	};


	/* Magic Mode */
	$scope.toggleMagicMode = function(){
		$scope.chk.related = !$scope.chk.related;
		$scope.chk.relatedToRecent = !$scope.chk.relatedToRecent;
		$scope.relatedCheckboxClicked();
		$scope.relatedToRecentCheckboxClicked();
		$scope.magicModeState = !$scope.magicModeState;		
	}

	$scope.updateMagicModeState = function(){
		$scope.magicModeState =($scope.chk.related && $scope.chk.relatedToRecent);
	}


	/* Easter Eggs */
	$scope.easterEgg = function(){
		alert("It looked unbalanced without the one on the left...");
	}

	var egg = new Egg("up,up,down,down,left,right,left,right,b,a", function() {
		playback.toggleMaxLengthState(function(resp){
			$scope.playbackMaxLengthState = resp.state;
		});
	}).listen();

	$scope.updateMaxLength = function(){
		playback.getMaxLengthState(function(resp){
			$scope.playbackMaxLengthState = resp.state;
		});
	};

    /* Volume Control */
    client.subscribe("get.volume", function(resp){
        $scope.volume = resp.payload.value;
    });
    
    $scope.volumeUpdate = function(){
        if($scope.volume > 100) $scope.volume = 100;
        if($scope.volume < 0) $scope.volume = 0;

        client.send({
            type: "command",
            key: "set.volume",
            details: {
                value: $scope.volume
            }
        });
    }



	/* UI REST Data Update Timer */

    /* TODO Replace timer
	$scope.restUpdate = function(){
		$scope.updateRelatedCheckbox();
		$scope.updateRelatedToRecentCheckbox();
		$scope.updateRecentCheckbox();
		$scope.updatePlaybackState();
		$scope.updateMaxLength();
		$scope.updateMagicModeState();
	};

	$scope.restUpdate();
	$scope.updateTimer = setInterval($scope.restUpdate, 5000);
    */

    /* TODO replace mechanisms
    socket.emit("queue:get");
    socket.emit("volume:get");
    socket.emit("volume:mute:get");
    */


   client.registerInitHook(()=>{
        client.send({type:"command", key:"get.queue"});
    });


}]);
