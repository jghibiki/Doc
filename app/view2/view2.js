'use strict';

angular.module('doc.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ["$scope", "socket", function($scope, socket) {
	socket.on("s2c", function(msg){
		$scope.count = msg;
		socket.emit('c2s', msg+1);
	});
}]);