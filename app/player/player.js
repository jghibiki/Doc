'use strict';

angular.module('doc.player', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/player', {
    templateUrl: 'player/player.html',
    controller: 'PlayerCtrl'
  });
}])

.controller('PlayerCtrl', ["$scope", "socket", function($scope, socket) {
	$scope.song = null
	$scope.stale = false;
	socket.on("song", function(song){
		$scope.song = song;
		$scope.songTimeout = setTimeout(function(){
			$scope.song = null;
			$scope.$apply();
			console.log("Requesting next song.");
			socket.emit("newSong");
		}, moment.duration(song.duration).asMilliseconds()+ 5000);
	});

	socket.on("ready", function(){
		if($scope.song !== null){
			socket.emit("fixCurrent", $scope.song);
		}
	})

	socket.on("skip", function(){
		clearTimeout($scope.songTimeout);
		$scope.song = null;
		socket.emit("newSong");
	})

	socket.emit("newSong");
}]);