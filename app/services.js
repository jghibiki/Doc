'use strict';

var docServices = angular.module("docServices", []);

docServices.factory("authentication", ["$resource", function($resource){
	var authService = {};

	authService.authToken = null;

	authService.xhr = $resource("authenticate/:verify", {}, {
		verify: {method: "POST", params:{verify: "verify"}, isArray:false},
		login: {method: "POST", params:{}, isArray:false}
	});

	authService.login = function(username, password, callback){
		this.xhr.login({
			username: username,
			password: password
		}, function(response){
			this.authToken = response.auth_token;
			callback();
		}, function(response){
			console.log(response);
		});
	};

	authService.logout = function(){
		alert("Logged Out!")	
	}

	authService._verifying = false;
	authService._verify = function(){
		if(!this._verifying && this.authToken !== null){
			this._verifying = true;
			this.xhr.verify({
				auth_token: this.authToken
			}, function(response){
				if(response.valid === false){
					this.authToken = null;
					this.logout();
				}
				this._verifying = false;
			}, function(response){
				console.log(response);
				this.authToken = null;
				this.logout();
				this._verifying = false;
			});
		}
	}

	authService._timer = setInterval(function(){
		this._verify();
	}, 600);

	return authService;
}]);