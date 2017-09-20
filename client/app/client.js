function resetConnection(client){
    if (client._.reset_timer === null){
        client._.reset_timer = setInterval(() => {
            console.log("Attempting to reconnect...");
            console.log(client._.reset_timer);
            client.init(client._.factory, client._.ip, client._.port);
        }, 5000);
    }
}

var client = {
    _: {
        id: Math.random().toString(36).substring(7),
        ip: null,
        port: null,
        factory: null,
        reset_timer: null,
        subs: {},
        ack: {},
        ack_once: {},
        once: {},
        init_hooks: [],
        inited: false,
        debug: false 
    },
    init: function($socketFactory, ip, port){
        client._.port = port;
        client._.ip = ip;
        client._.factory = $socketFactory;
        client.ws = $socketFactory("ws://" + ip + ":" + port )
        client.ws.onOpen(function(event){
            console.log("Server Connection Established.");
            client.send({"type": "ping"});
            client.send({"type": "register"});


            client.ws.onCloseCallbacks = [];
            client.ws.onClose(function(event){
                console.log("Server Connection Closed. Reconnecting...");
                resetConnection(client);
            });

            client.ws.onErrorCallbacks = [];
            client.ws.onError(function(event){
                console.log("Server Connection Errored. Reconnecting...");
                resetConnection(client);
            });

            // clear reset timer on conenct
            if(client._.reset_timer !== null){
                console.log("Cleared Reconnect Timer");
                clearTimeout(client._.reset_timer);
                client._.reset_timer = null;
            }

            for(var callback of client._.init_hooks){
                callback();
            }
        });

        if(!client._.inited){
            
            client.ws.onCloseCallbacks = [];
            client.ws.onClose(function(event){
                console.log("Server Connection Closed. Reconnecting...");
                resetConnection(client);
            });

            client.ws.onErrorCallbacks = [];
            client.ws.onError(function(event){
                console.log("Server Connection Errored. Reconnecting...");
                resetConnection(client);
            });
        }

        client.ws.onMessage(function(event){
            var data = JSON.parse(event.data);
            if(client._.debug){
                console.log(event.data);
            }

            if(data.type == "pong"){ //handle ping pong
                console.log("pong");
            }
            else if(data.type == "broadcast"){
                if(data.key === "bulk"){
                    for(var frame of data.frames){
                        if(client._.subs.hasOwnProperty(frame.key)){
                            for(var sub of client._.subs[frame.key]){ //handle global broadcast
                                sub(frame);
                            }
                        }
                        if(client._.once.hasOwnProperty(frame.key)){
                            for(var sub of client._.once[frame.key]){
                                sub(frame);
                            }
                            client._.once[frame.key] = [];
                        }
                    }
                }
                else{
                    if(client._.subs.hasOwnProperty(data.key)){
                        for(var sub of client._.subs[data.key]){ //handle global broadcast
                            sub(data);
                        }
                    }
                    if(client._.once.hasOwnProperty(data.key)){
                        for(var sub of client._.once[data.key]){
                            sub(data);
                        }
                        client._.once[data.key] = [];
                    }
                }
            }
            else if(data.type == "broadcast_target"  // handle targeted broadcast
                && data.targets.indexOf(client._.id) > -1){
                if(client._.subs.hasOwnProperty(data.key)){
                    for(var sub of client._.subs[data.key]){
                        sub(data);
                    }
                }
                if(client._.once.hasOwnProperty(data.key)){
                    for(var sub of client._.once[data.key]){
                        sub(data);
                    }
                    client._.once[data.key] = [];
                }
            }   
            else if(data.type == "acknowledge"){
                if(client._.debug){
                    console.log("Server acknowledged request for: " + data.key);
                }
                if(client._.ack.hasOwnProperty(data.key)){
                    for(var sub of client._.ack[data.key]){
                        sub(data);
                    }
                }
            }
            else if(data.type == "error"){
                console.log(data)
            }
        });


        client._.inited = true;
    },
    subscribe: function(key, callback){
        if(!client._.subs.hasOwnProperty(key)){
            client._.subs[key] = []; 
        }
        client._.subs[key].push(callback);
    },
    unsubscribe: function(key, callback){
        if(client._.subs.hasOwnProperty(key)){
            var index = client._.subs[key].indexOf(callback);
            if(index >= 0){
                client._.subs[key].slice(index, 1);
            }
        }
    },
    once: function(key, callback){
        if(!client._.once.hasOwnProperty(key)){
            client._.once[key] = []; 
        }
        client._.once[key].push(callback);
    },
    ack: function(key, callback){
        if(!client._.ack.hasOwnProperty(key)){
            client._.ack[key] = []; 
        }
        client._.ack[key].push(callback);
    },
    ack_once: function(key, callback){
        if(!client._.ack_once.hasOwnProperty(key)){
            client._.ack_once[key] = []; 
        }
        client._.ack_once[key].push(callback);
    },
    registerInitHook(callback){
        if(!client._.inited){
            client._.init_hooks.push(callback);
        }
        else{
            callback();
        }
    },
    prepareSend: function(payload, broadcast){
        broadcast = broadcast || false;
        payload.broadcast = broadcast;

        payload.id = client._.id;

        return payload
    },
    send: function(payload, broadcast){
        payload = client.prepareSend(payload, broadcast)
        client.ws.send(JSON.stringify(payload));
    },
    sendBulk: function(payloads, broadcast){
        var prepared_payloads = [];
        for(var payload of payloads){
            prepared_payloads.push(
                client.prepareSend(payload, broadcast));
        }
        client.send({ frames: prepared_payloads, key: "bulk", type: "command"}, broadcast);
    }
}
