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

    $scope.favorites = localStorage.getItem("favorites");
    if($scope.favorites !== null && $scope.favorites !== undefined){
        $scope.favorites = JSON.parse($scope.favorites);
    }
    else {
        $scope.favorites = [];
    }

	$scope.queue = [];
    $scope.history = [];
    $scope.volume = 0;
    $scope.mute = false;
	$scope.currentlyPlaying = null;
    $scope.currentlyPlayingAuto = false;
    $scope.showFullQueue = false;
    $scope.showFullHistory= false;
    $scope.showFullFavorites = false;
    $scope.showFullSearch = false;
    $scope.historyHeight = "200px";
    $scope.queueHeight = "200px";
    $scope.favoritesHeight = "200px";
    $scope.searchHeight = "200px";
	$scope.chk = {
		recent: false,
		related: false,
		relatedToRecent: false
	}
	$scope.showControls = false;
	$scope.playbackState = false;
	$scope.magicModeState = true;
	$scope.playbackStateIcon = "play_arrow";
	$scope.playbackStateMessage = "Resume Playback";
	$scope.playbackMaxLengthState = true;
    $scope.tickerTapeTimer = null;
    $scope.tickerTapeCounter = 0;

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



	$scope.clearRecent = function(){
        client.send({
            type: "command",
            key: "remove.history"
        }, true);
        $scope.history = [];
	}


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

    $scope.requestSong = function(song){

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
    }

    client.subscribe("set.current_song", function(data){
        $scope.currentlyPlaying = data.payload.song;

        if($scope.tickerTapeTimer !== null){
            clearTimeout($scope.tickerTapeTimer);
        }
        $scope.tickerTapeTimer = setInterval(ticker_tape, 250)
    });

    client.subscribe("get.current_song", function(data){
        $scope.currentlyPlaying = data.payload;

        if($scope.tickerTapeTimer !== null){
            clearTimeout($scope.tickerTapeTimer);
        }
        $scope.tickerTapeTimer = setInterval(ticker_tape, 250)
    });

    function ticker_tape(){
        if ($scope.tickerTapeCounter >= $scope.currentlyPlaying.title.length){
            $scope.tickerTapeCounter = -5;
        }

        if($scope.tickerTapeCounter < 0){
            document.title = "Doc: " + $scope.currentlyPlaying.title;
            $scope.tickerTapeCounter += 1
            return
        }

        document.title = "Doc: " + $scope.currentlyPlaying.title.substring($scope.tickerTapeCounter, $scope.currentlyPlaying.title.length);

        $scope.tickerTapeCounter += 1
    }

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
        client.send({
            type: "command",
            key: "toggle.magic_mode"
        }, true);
	}

    client.subscribe("toggle.magic_mode", function(data){
		$scope.magicModeState = !$scope.magicModeState;		
    });

    client.subscribe("get.magic_mode", function(data){
		$scope.magicModeState = data.payload.magic_mode;
    });


	/* Easter Eggs */
	$scope.easterEgg = function(){
		alert("It looked unbalanced without the one on the left...");
	}

	var egg = new Egg("up,up,down,down,left,right,left,right,b,a", function() {
        client.send({
            type: "command",
            key: "toggle.duration_limit"
        }, true);
	}).listen();

    client.subscribe("toggle.duration_limit", function(){
        $scope.playbackMaxLengthState = ! $scope.playbackMaxLengthState;
    })

    client.subscribe("get.duration_limit", function(data){
        $scope.playbackMaxLengthState = data.payload.duration_limit;
    });


    /* Volume Control */
    client.subscribe("get.volume", function(resp){
        $scope.volume = resp.payload.volume;
    });
    
    $scope.volumeUpdate = function(){
        if($scope.volume > 100) $scope.volume = 100;
        if($scope.volume < 0) $scope.volume = 0;

        client.send({
            type: "command",
            key: "set.volume",
            details: {
                volume: $scope.volume
            }
        }, true);
    }

    client.subscribe("set.volume", function(resp){
        $scope.volume = resp.details.volume;
    });


    client.subscribe("get.history", function(data){
        $scope.history = data.payload;
    });

    client.subscribe("add.history", function(data){
        $scope.history.push(data.payload);
    })

    client.subscribe("remove.history", function(){
        $scope.history = [];
    });


    $scope.addFavorite = function(song){
        /* check to see if already in favs*/
        for(var s of $scope.favorites){
            if(s.id === song.id){
                return;
            }
        }
        $scope.favorites.push(song)
        localStorage.setItem("favorites", JSON.stringify($scope.favorites));
    }

    $scope.rmFavorite = function(song){
        for(var i=0; i < $scope.favorites.length; i++){
            if(song.id === $scope.favorites[i].id){
                $scope.favorites.splice(i, 1);
                localStorage.setItem("favorites", JSON.stringify($scope.favorites));
            }
        }
    }

   $scope.toggleShowFullFavorites= function(){ 
        $scope.showFullFavorites = ! $scope.showFullFavorites
        $scope.favoritesHeight = $scope.favoritesHeight === "200px" ? "500px" : "200px"
   }

   $scope.toggleShowFullQueue = function(){ 
        $scope.showFullQueue = ! $scope.showFullQueue 
        $scope.queueHeight = $scope.queueHeight === "200px" ? "500px" : "200px"
   }

   $scope.toggleShowFullHistory = function(){ 
        $scope.showFullHistory = ! $scope.showFullHistory
        $scope.historyHeight = $scope.historyHeight === "200px" ? "500px" : "200px"
   }

   $scope.toggleShowFullSearch = function(){ 
        $scope.showFullSearch = ! $scope.showFullSearch
        $scope.searchHeight = $scope.searchHeight === "200px" ? "500px" : "200px"
   }

   $scope.changeTheme = function(){
        localStorage.setItem("theme_color", $scope.theme); 
        localStorage.setItem("darkTheme", $scope.darkTheme); 
        location.reload();
    }

   client.registerInitHook(()=>{
        client.send({type:"command", key:"get.queue"});
        client.send({type:"command", key:"get.current_song"});
        client.send({type:"command", key:"get.play_pause"});
        client.send({type:"command", key:"get.magic_mode"});
        client.send({type:"command", key:"get.duration_limit"});
        client.send({type:"command", key:"get.volume"});
        client.send({type:"command", key:"get.history"});
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
