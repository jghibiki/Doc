'use strict';

// Declare app level module which depends on views, and components
angular.module('doc', [
  'ngRoute',
  'btford.socket-io',
  'doc.view1',
  'doc.view2',
  'doc.version',
  'docServices'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).
factory('socket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('localhost:8000')
  });
});