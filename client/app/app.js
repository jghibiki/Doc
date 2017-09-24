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
    client.init($websocket, window.host, "8081");
    return {};
}).
config(function($mdThemingProvider) {


    var theme = localStorage.getItem("theme_color"); 
    if(theme === null || theme === undefined){
        theme = "yellow"; 
    }

    var darkTheme = localStorage.getItem("darkTheme"); 
    if(darkTheme === null || darkTheme === undefined){
        darkTheme = true; 
    }
    if(darkTheme !== null && darkTheme !== undefined){
        darkTheme = ( darkTheme == 'true' );
    }

    if(darkTheme){
        $mdThemingProvider.theme('default')
            .primaryPalette(theme)
            .accentPalette('orange')
            .dark();
    }
    else {
        $mdThemingProvider.theme('default')
            .primaryPalette(theme)
            .accentPalette('orange')
    }

    $mdThemingProvider.alwaysWatchTheme(true);
}).
run(["ngSocket", function(ws){

}]);
