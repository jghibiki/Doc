'use strict';

angular.module('doc.player', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/player', {
    templateUrl: 'player/player.html',
    controller: 'PlayerCtrl'
  });
}])

.controller('PlayerCtrl', ["$scope", function($scope) {
	$scope.song = null
	$scope.stale = false;

	client.subscribe("set.current_song", function(req){
		$scope.song = req.payload.song;
		$scope.songTimeout = setTimeout(function(){
			//$scope.song = null;
			$scope.$apply();
			console.log("Requesting next song.");
            /* TODO replace pulling methodology in favor of pushing 
			socket.emit("newSong");
            */
		}, moment.duration($scope.song.duration).asMilliseconds()+ 5000);
	});

	client.subscribe("set.skip", function(){
		clearTimeout($scope.songTimeout);
		$scope.song = null;
	})

    client.subscribe("trigger.refresh", function(){
        location.reload();
    });

    /* Handles first pull of queue when the client starts */
    client.registerInitHook(()=>{
        client.send({
            type: "command",
            key: "get.queue"
        });
    });
}]);
