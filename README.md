# Doc

Hopefully a much simpler replacement for [Mopey](https://github.com/jghibiki/mopey).
Because mopey kind of sucks due to it's dependence on mopidy-youtube. 

*Where did the name come from?* Well, Mopey sounds like it should be one of the seven dwarves (it's not) but Doc is so that's where I got the name from.

## Reqirements
- Python 3.6+ 
- NodeJs and NPM

## Installation and Running the System
1. Clone the repo:
```shell

$ git clone https://github.com/jghibiki/Doc.git
```

2. In two separate terminals change directory into the server and client.
3. In the server directory, run `pip install -r requirements.txt` to install python requirements.
4. In the client directory, run `npm install` to install node js requirements.
5. In the client directory edit: `src/Host.js` and change `"localhost"` to the IP address of the machine you wish to host the server.
6. In the server directory, run `python doc.py` to start the server
7. In the client directory, run `npm run start` to start a local copy of the client. This should be sufficient for small scale usage. For higher volume traffic, you will need to run `yarn run build` and host the generated files with a web server.
8. To play music, you will need a dedicated machine to run the player on. To run the player open a browser window and navigate to `localhost:3000/player` (note: you may need to change the port number based on what port your client is running on). This window will now play any requests sent to the server. To access the client front end navigate to `[your-ip-address]:3000` on another device to queue up videos.
