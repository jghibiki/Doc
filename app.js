"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var YouTube = require("youtube-node");
var moment = require("moment");
var loudness = require('loudness');
var lev = require("./levenshtein.js")

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80, "0.0.0.0");
console.log("Listening on port 80.")
app.use(express.static("./app"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var youtube = null;
resetParts();


function resetParts(){
	console.log("Clear Parts");
	youtube = new YouTube();
	youtube.clearParts();
	youtube.setKey("AIzaSyAPLpQrMuQj6EO4R1XwjwS2g47dqpFXW3Y");
	youtube.addParam("order", "relevance")
}

/*********************
Modify Date Prototype
**********************/
Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}

/**********
Queue Setup
***********/
var currentlyPlaying = null;
var queue = [];
var recent = [];
var username = "abc";
var password = "123";
var tokens = [];
var playRelated = false;
var relatedToRecent = false;
var playRecent = false;
var skip = false;
var newSongTimer = null;
var watchForSkipTimer = null;
var hasConnection = false;
var playing = true;
var maxLength = 60;
var maxLengthLimit = true;

/***************
 Rest end points 
****************/

var router = express.Router();

/* Authenticatiom */
router.post('/authenticate', function(req, res){
	var data = req.body;
	if(data["username"] === username && data["password"] === password){

		var token = guid();
		var expiration = new Date();
		expiration.setHours(expiration.getHours() + 1);
		var payload = { 
			token: token, 
			expiration: expiration
		};

		tokens.push(payload) ;
		res.json(payload)
	}
});

/* Playback */
router.get('/playback/related', function(req, res){
	res.json({"state": playRelated});
});

router.post('/playback/related', function(req, res){
	playRelated = req.body.state;
	console.log(playRelated?"Enabling related":"Disabling related");
	var obj = {"state": playRelated}
	res.json(obj);
});

router.get('/playback/relatedToRecent', function(req, res){
	res.json({state:relatedToRecent});
})

router.post('/playback/relatedToRecent', function(req, resp){
	relatedToRecent = req.body.state;
	console.log(relatedToRecent?"Enabling related to recent":"Disabling related to recent");
	var obj = {state: relatedToRecent};
	resp.json(obj);
})

router.get('/playback/recent', function(req, res){
	res.json({"state": playRecent});
});

router.post('/playback/recent', function(req, res){
	playRecent = req.body.state
	console.log(playRecent?"Enabling recent":"Disabling recent");
	var obj = {"state": playRecent}
	res.json(obj);
});

router.delete('/playback/recent', function(req, res){
	recent = [];
	console.log("Clearing recent list");
	res.json({"result": "success"});
});

router.post('/playback/skip', function(req, res){
	if(skip !== true){
		console.log("Skipping current song");
		skip = true;
	}
	res.json({"result": "success"});
})

router.get('/playback/state', function(req, res){
	res.json({state: playing});
});

router.post('/playback/state', function(req, res){
	playing = req.body.state;
	if(playing){
		console.log("Starting Playback.");
	}
	else{
		console.log("Pausing Playback.");
	}
	res.json({state: playing});
});

router.get('/playback/max-length', function(req, res){
	res.json({state: maxLengthLimit});
});

router.post('/playback/max-length', function(req, res){
	maxLengthLimit = !maxLengthLimit;
	if(maxLengthLimit){
		console.log("Enabling Max Length Limit.");
	}	
	else{
		console.log("Disabling Max Length Limit.");
	}
	res.json({state: maxLengthLimit});
});



app.use("/api", router)


var controllerSocket = io.of('/controller')
controllerSocket.on('connection', function(socket){
    console.log("Controller connected.");

    /* Search */
    socket.on("search", function(query){

        resetParts();

        youtube.search(query, 50, function(error, result){
            if(error){
                console.log(error);
            }
            else{
                var payload = [];
                for(var i=0; i<result.items.length; i++){
                    if(result.items[i].id.kind === "youtube#video"){
                        var item = result.items[i];
                        payload.push({
                            url: "https://www.youtube.com/embed/" + item.id.videoId + "?autoplay=1",
                            yt: item.id.videoId,
                            title: item.snippet.title,
                            uploader: item.snippet.channelTittle,
                            description: item.snippet.description,
                            thumbnail: item.snippet.thumbnails.high
                        });
                    }
                }	
                socket.emit('search::response', payload);
            }
        })	
    });


    /* Queue add */
    socket.on("queue:add", function(song){
        console.log("Recived request for song: " + song.url);
        youtube.getById(song.yt, function(error, result){
            if(error){
                console.log("Error: " + error)
            }
            else{
                var duration = result.items[0].contentDetails.duration;
                if( (moment.duration(duration) < moment.duration(maxLength, "minutes")) || !maxLengthLimit){
                    var obj = {
                        id: guid(),
                        yt: song.yt,
                        url: song.url,
                        title: song.title,
                        uploader: song.uploader,
                        description: result.items[0].snippet.description,
                        thumbnail: song.thumbnail,
                        date: new Date(),
                        duration: result.items[0].contentDetails.duration,

                    };

                    queue.push(obj);
                    socket.emit("queue:add::response", obj);
                    controllerSocket.emit("queue:get::response", { queue:queue, current:currentlyPlaying });
                }
                else{
                    console.log("Song " + req.body.title + " too long.")
                }
            }
        });
    });

    socket.on("queue:get", function(req){
        socket.emit("queue:get::response", { queue:queue, current:currentlyPlaying });
    });

    /* Volume */
    socket.on("volume:get", function(){
        console.log("getting volume");
        loudness.getVolume(function(err, vol){
            if(err !== null){
                console.log(err);
            }
            else{
                console.log("volume: " + vol);
                socket.emit("volume:get::response", vol);
            }
        });
    });

    socket.on("volume:set", function(vol){
        console.log("Setting volume to " + vol + "%");
        loudness.setVolume(vol, function(err){
            if(err !== null){
                console.log(err);
            }
            else{
                console.log("Volume set to " + vol + "%");
                controllerSocket.emit("volume:get::response", vol);
            }
        });
    });

});

/*****************
Player Web Sockets
******************/
var playerSocket = io.of('/player')
playerSocket.on('connection', function (socket) {
	if(!hasConnection){
		console.log("Client Connected")
		hasConnection = true;
		socket.on("newSong", function(){
				console.log("A new song was requested.");
				currentlyPlaying = null;
				newSongTimer = setTimeout(newSong, 1000, socket);
				watchForSkipTimer = setTimeout(watchForSkip, 1000, socket);
		});

		socket.on("disconnect", function(){
			clearTimeout(newSongTimer);
			newSongTimer = null;
			clearTimeout(watchForSkipTimer);
			watchForSkipTimer = null;
			hasConnection = false;
			console.log("Client Disconnected");
		});

		socket.on("fixCurrent", function(current){
			currentlyPlaying = current.title;
			recent.push({song: current, lastPlayed:Date()});
		})

		socket.emit("ready");
	}
	else{
		console.log("Player connection exists denying new connection attempts util current client leaves.");
	}
});


function watchForSkip(socket){
	if(skip && playing){
		console.log("Song Skipped.");
		skip = false;
		clearTimeout(newSongTimer);
		socket.emit("skip");
	}
	setTimeout(watchForSkip, 1000, socket);
}

function newSong(socket){
	console.log("There are " + queue.length + " items in the queue and " + recent.length + " items played recently.");
	resetParts();
	if(!playing){
		console.log("Playback is paused waiting.");
		newSongTimer = setTimeout(newSong, 1000, socket);
		return;
	}
	if(queue.length > 0){
		var song = queue.shift();
		recent.push({ song:song, lastPlayed:Date() });
		currentlyPlaying = song.title;
		console.log("Sending Song url: " + song.url);
		socket.emit("song", song);
	}
	else if((playRecent || playRelated) && recent.length > 0){
		var recentSong = recent[Math.floor(Math.random()*recent.length)];
		if(playRecent === true 
			&& (Date() - recentSong.lastPlayed) > 60*60*1000){
			console.log("Sending Recent Song: " + recentSong.song.url);
			socket.emit("song", recentSong.song);
		}
		else if(playRelated){
			console.log("Attempting to play a related song.");
			youtube.related(recentSong.song.yt, 20, function(error, result){
				if(error){
					console.log(error);
					newSongTimer = setTimeout(newSong, 1000, socket);
				}
				else{
					for(var i=0; i<result.items.length; i++){
						for(var j=0; j<recent.length; j++){
							if(recent[j].yt === result.items[i].id.videoId ){ //|| diff(result.items[i].snippet.title, recentSong.song.title) < 0.90){
								console.log("Removed: " + result.items[i].snippet.title);
								result.items.pop(i);
							}
						}
					}
					if(result.items.length > 0){
						var item = result.items[Math.floor(Math.random()*result.items.length)];

						var song = {
							url: "https://www.youtube.com/embed/" + item.id.videoId + "?autoplay=1",
							yt: item.id.videoId,
							title: item.snippet.title,
							uploader: item.snippet.channelTittle,
							description: item.snippet.description,
							thumbnail: item.snippet.thumbnails.high
						}

						resetParts();
						youtube.getById(song.yt, function(error, result){
							if(error){
								console.log("Error: " + error)
								newSongTimer = setTimeout(newSong, 1000, socket);
							}
							else{
								var duration = result.items[0].contentDetails.duration;
								console.log("Duration " + moment.duration(duration));
								if( (moment.duration(duration) < moment.duration(maxLength, 'minutes') ) || !maxLengthLimit){
									song.duration = duration;
									song.description = result.items[0].snippet.description;
									console.log("Sending related song: " + song.url);
									if(relatedToRecent){
										recent.push({song:song, lastPlayed:Date()});
									}
									currentlyPlaying = song.title;
									socket.emit("song", song);
								}
								else{
									console.log("Song " + song.title + " too long.");
									newSongTimer = setTimeout(newSong, 1000, socket);
								}
							}

						});
					}
					else{
						newSongTimer = setTimeout(newSong, 1000, socket);
					}
				}
			});
		}
	}
	else{
		console.log("No songs yet...")	
		newSongTimer = setTimeout(newSong, 1000, socket);
	}
}




/*
Private Functions
*/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function diff(a, b){
	var max = Math.max(a.length, b.length);
	return (max - lev.getEditDistance(a, b))/max;
}
