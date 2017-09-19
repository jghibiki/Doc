'use strict';

// Declare app level module which depends on views, and components
angular.module('doc', [
  'ngRoute',
  'ngMaterial',
  'ngAnimate',
  'ngResource',
  'ngWebSocket',
  'doc.client',
  'doc.player',
  'doc.version',
]).
config(['$routeProvider', "$sceDelegateProvider", function($routeProvider, $sceDelegateProvider) {
  $routeProvider.otherwise({redirectTo: '/'});

  $sceDelegateProvider.resourceUrlWhitelist([
    "self",
    "http://www.youtube.com/**",
    "https://www.youtube.com/**"
    ])
}]).
factory("ngSocket", function($websocket){
    client.init($websocket, "127.0.0.1", "8081");
    return {};
}).
run(["ngSocket", function(ws){

}]);
