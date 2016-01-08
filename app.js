var express = require("express");
var bodyParser = require("body-parser");
var YouTube = require("youtube-node");
var moment = require("moment");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000, "0.0.0.0");
console.log("Listening on port 8000.")
app.use(express.static("./app"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var youtube = new YouTube();
youtube.setKey("AIzaSyAPLpQrMuQj6EO4R1XwjwS2g47dqpFXW3Y")


/**********
Queue Setup
***********/
var queue = []
var username = "abc";
var password = "123";
var tokens = [];

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

/* Queue */
router.get('/queue', function(req, res){
	res.json(queue);
})

router.post('/queue', function(req, res){
	var obj = {
		id: guid(),
		yt: req.body.yt,
		url: req.body.url,
		title: req.body.title,
		uploader: req.body.uploader,
		description: req.body.description,
		thumbnail: req.body.thumbnail,
		date: new Date(),
	};

	youtube.getById(req.body.yt, function(error, result){
		if(error){
			console.log("Error: " + error)
		}
		else{
			obj.duration = result.items[0].contentDetails.duration;
			obj.description = result.items[0].snippet.description;
			queue.push(obj);
		}
	});

	// res.json(obj);
});

/* Search */
router.get("/search/:q", function(req, res){
	youtube.search(req.params.q, 50, function(error, result){
		if(error){
			console.log(error);
		}
		else{
			payload = [];
			for(var i=0; i<result.items.length; i++){
				if(result.items[i].id.kind === "youtube#video"){
					item = result.items[i];
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
			res.json(payload);
		}
	})	
});


app.use("/api", router)

/**********
Web Sockets
**********/
io.on('connection', function (socket) {
	socket.on("newSong", function(){
		newSong(socket);
	})
});

function newSong(socket){
	if(queue.length > 0){
		var song = queue.shift();
		console.log("Sending Song url: " + song.url);
		socket.emit("song", song);
	}
	else{
		console.log("No songs yet...")	
		setTimeout(newSong, 1000, socket);
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