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

.controller('ClientCtrl', ["$scope", function($scope, $mdThemingProvider) {


	/* Definitions */ 
    $scope.theme = localStorage.getItem("theme_color"); 
    if($scope.theme === null || $scope.theme === undefined){
        $scope.theme = 'yellow';
    }

    $scope.darkTheme = localStorage.getItem("darkTheme"); 
    if($scope.darkTheme === null || $scope.darkTheme === undefined){
        $scope.darkTheme = true;
    }
    if($scope.darkTheme !== null && $scope.darkTheme !== undefined){
        $scope.darkTheme = ( $scope.darkTheme == 'true' );
    }


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
	$scope.playbackStateIcon = "play_arrow";
	$scope.playbackStateMessage = "Resume Playback";
	$scope.playbackMaxLengthState = true;
	$scope.magicModeState = false;

    $scope.themeColors = [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "grey",
        "blue-grey",
    ];

	/* Skip Current Song */
	$scope.skipSong = function(){
        client.send({
            type: "command",
            key: "set.skip", 
            details: {}
        }, true);
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
        // send toggle command
        client.send({
            type: "command",
            key: "toggle.play_pause"
        }, true);

	};

    client.subscribe("toggle.play_pause", function(data){
        // update playback state
		$scope.playbackState = !$scope.playbackState;

        if($scope.playbackState){
            $scope.playbackStateIcon = "pause";
            $scope.playbackStateMessage = "Pause Playback";
        }
        else{
            $scope.playbackStateIcon = "play_arrow";
            $scope.playbackStateMessage = "Resume Playback";
        }
    });

    client.subscribe("get.play_pause", function(data){
        $scope.playbackState = data.payload.playing;

        if($scope.playbackState){
            $scope.playbackStateIcon = "pause";
            $scope.playbackStateMessage = "Pause Playback";
        }
        else{
            $scope.playbackStateIcon = "play_arrow";
            $scope.playbackStateMessage = "Resume Playback";
        }
    });



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

                //validate the song isnt already in the queue
                for(var v of $scope.queue){
                    if( song.id === v.id ){
                        return;
                    }
                }

                client.send({
                    type: "command",
                    key: "add.queue", 
                    details: song 
                }, true);
                break;
            }
        }
    }

    client.subscribe("set.current_song", function(data){
        $scope.currentlyPlaying = data.payload.song;
    });

    client.subscribe("get.current_song", function(data){
        $scope.currentlyPlaying = data.payload;
    });

    client.subscribe("set.skip", function(){
        $scope.currentlyPlaying = null;
    });


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

    client.subscribe("remove.queue", function(data){
        var id = data.payload.id;
        for(var i=0; i < $scope.queue.length; i++){
            if( id === $scope.queue[i].id ){
                $scope.queue.splice(i, 1);
            }
        }
    });

    client.subscribe("add.queue", function(data){
        $scope.queue.push(data.details);

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

   $scope.changeTheme = function(){
        localStorage.setItem("theme_color", $scope.theme); 
        localStorage.setItem("darkTheme", $scope.darkTheme); 
        location.reload();
    }

   client.registerInitHook(()=>{
        client.send({type:"command", key:"get.queue"});
        client.send({type:"command", key:"get.current_song"});
        client.send({type:"command", key:"get.play_pause"});
    });

}]).
filter('capitalizeThemeName', function(){
    return function(input){
        var output = "";
        for(var i of input.split("-")){
            output += i.charAt(0).toUpperCase() + i.substring(1) + " ";
        }
        return output
    };
});
