'use strict';

var docServices = angular.module("docServices", []);

docServices.factory("authentication", ["$resource", function($resource){
	var authService = {};

	authService.authToken = null;

	authService._xhr = $resource("api/authenticate/:verify", {}, {
		verify: {method: "POST", params:{verify: "verify"}, isArray:false},
		login: {method: "POST", params:{}, isArray:false}
	});

	authService.login = function(username, password, callback){
		this._xhr.login({
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
			this._xhr.verify({
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

docServices.factory("queue", ["$resource", function($resource){
	var queueService = {};

	queueService._xhr = $resource("api/queue/:requestId", {}, {
		query: { action: "GET", isArray: false}
	});

	queueService.get = function(callback){
		var queue = this._xhr.query(function(){
			callback(queue);
		});
	};

	queueService.add = function(request, callback){
		var response = this._xhr.save(request, function(){
			callback(response);	
		});
	}

	return queueService;
}]);

docServices.factory("search", ["$resource", function($resource){
	var xhr = $resource("api/search/:q", {}, {})

	return function(query, callback){
		var result = xhr.query({q: query}, function(){
			callback(result);	
		});
	}

}]);

docServices.factory("playback", ["$resource", function($resource){
	var playbackService = {};
	
	playbackService._related_xhr =  $resource("api/playback/related", {}, {});
	playbackService._recent_xhr = $resource("api/playback/recent", {}, {});
	playbackService._skip_xhr = $resource("api/playback/skip", {}, {});
	playbackService._relatedToRecent_xhr = $resource("api/playback/relatedToRecent", {}, {});
	playbackService._state_xhr = $resource("api/playback/state", {}, {});
	playbackService._max_length_xhr = $resource("api/playback/max-length", {}, {});

	/*  Recent */

	playbackService.getRecent = function(callback){
		var response = this._recent_xhr.get(function(){
			callback(response);
		});
	};

	playbackService.setRecent = function(value, callback){
		var response = this._recent_xhr.save({state: value}, function(){
			callback(response);
		});
	};

	playbackService.clearRecentList = function(callback){
		var response = this._recent_xhr.delete(function(){
			if(callback !== null && callback !== undefined){
				callback(response);
			}
		});
	};

	/* Related To Recent */

	playbackService.getRelatedToRecent = function(callback){
		var response = this._relatedToRecent_xhr.get(function(){
			callback(response);
		});
	};

	playbackService.setRelatedToRecent = function(value, callback){
		var response = this._relatedToRecent_xhr.save({state: value}, function(){
			callback(response);	
		});
	};

	
	/* Related */

	playbackService.getRelated = function(callback){
		var response = this._related_xhr.get(function(){
			callback(response);
		});
	};

	playbackService.setRelated = function(value, callback){
		var response = this._related_xhr.save({state: value}, function(){
			callback(response);
		});
	};


	playbackService.skip = function(callback){
		var response = this._skip_xhr.save(function(){
			if(callback !== null && callback !== null){
				callback(response);
			}
		});
	};

	/* Playback */
	playbackService.getState = function(callback){
		var response = this._state_xhr.get(function(){
			callback(response);
		});
	};

	playbackService.setState = function(value, callback){
		var response = this._state_xhr.save({state: value}, function(){
			if(callback !== null && callback !== undefined){
				callback(response);
			}
		});
	};

	/* Max Length */

	playbackService.getMaxLengthState = function(callback){
		var response = this._max_length_xhr.get(function(){
			callback(response);
		})
	};

	playbackService.toggleMaxLengthState = function(callback){
		var response = this._max_length_xhr.save({"some": "data"}, function(){
			callback(response)
		});
	};

	return playbackService;
}]);

