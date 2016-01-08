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
	socket.on("song", function(song){
		$scope.song = song;
		setTimeout(function(){
			$scope.song = null;
			$scope.$apply();
			console.log("Requesting next song.");
			socket.emit("newSong");
		}, moment.duration(song.duration).asMilliseconds());
	});

	socket.emit("newSong");
}]);