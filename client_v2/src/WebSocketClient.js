import React, { Component } from 'react';

import Host from './Host.js';


class WebSocketClient {
    constructor(){
        this.state = {
            id: Math.random().toString(36).substring(7),
            ip: null,
            port: null,
            factory: WebSocket,
            reset_timer: null,
            subs: {},
            ack: {},
            ack_once: {},
            once: {},
            init_hooks: [],
            inited: false,
            debug: false 
        };
    }

    init(ip, port){
        this.state.port = port;
        this.state.ip = ip;
        this.ws = new this.state.factory("ws://" + ip + ":" + port)

        var client = this;

        console.log(client.ws);

        client.ws.onopen = (event) =>{
            console.log("Server Connection Established.");

            client.send({"type": "ping"})
            client.send({"type": "register"})

            client.ws.oncloseCallbacks = [];
            client.ws.onclose = function(event){
                console.log("Server Connection Closed. Reconnecting...");
                client.resetConnection();
            };

            client.ws.onerrorCallbacks = [];
            client.ws.onerror = function(event){
                console.log("Server Connection Errored. Reconnecting...");
                client.resetConnection();
            };

            // clear reset timer on conenct
            if(client.state.reset_timer !== null){
                console.log("Cleared Reconnect Timer");
                clearTimeout(client.state.reset_timer);
                client.state.reset_timer = null;
            }

            for(let callback of client.state.init_hooks){
                callback();
            }

        };

        if(!client.state.inited){

            client.ws.oncloseCallbacks = [];
            client.ws.onclose = function(event){
                console.log("Server Connection Closed. Reconnecting...");
                client.resetConnection();
            };

            client.ws.onerrorCallbacks = [];
            client.ws.onerror = function(event){
                console.log("Server Connection Errored. Reconnecting...");
                client.resetConnection();
            };
        }

        client.ws.onmessage = function(event){
            let data = JSON.parse(event.data);
            if(client.state.debug){
                console.log(event.data);
            }

            if(data.type === "pong"){ //handle ping pong
                console.log("pong");
            }
            else if(data.type === "broadcast"){
                if(data.key === "bulk"){
                    for(let frame of data.frames){
                        if(client.state.subs.hasOwnProperty(frame.key)){
                            for(let sub of client.state.subs[frame.key]){ //handle global broadcast
                                sub(frame);
                            }
                        }
                        if(client.state.once.hasOwnProperty(frame.key)){
                            for(let sub of client.state.once[frame.key]){
                                sub(frame);
                            }
                            client.state.once[frame.key] = [];
                        }
                    }
                }
                else{
                    if(client.state.subs.hasOwnProperty(data.key)){
                        for(let sub of client.state.subs[data.key]){ //handle global broadcast
                            sub(data);
                        }
                    }
                    if(client.state.once.hasOwnProperty(data.key)){
                        for(let sub of client.state.once[data.key]){
                            sub(data);
                        }
                        client.state.once[data.key] = [];
                    }
                }
            }
            else if(data.type === "broadcast_target"  // handle targeted broadcast
                && data.targets.indexOf(client.state.id) > -1){
                if(client.state.subs.hasOwnProperty(data.key)){
                    for(let sub of client.state.subs[data.key]){
                        sub(data);
                    }
                }
                if(client.state.once.hasOwnProperty(data.key)){
                    for(let sub of client.state.once[data.key]){
                        sub(data);
                    }
                    client.state.once[data.key] = [];
                }
            }
            else if(data.type === "acknowledge"){
                if(client.state.debug){
                    console.log("Server acknowledged request for: " + data.key);
                }
                if(client.state.ack.hasOwnProperty(data.key)){
                    for(let sub of client.state.ack[data.key]){
                        sub(data);
                    }
                }
            }
            else if(data.type === "error"){
                console.log(data)
            }
        };


        client.state.inited = true;
        
    }

    subscribe(key, callback){
        if(!this.state.subs.hasOwnProperty(key)){
            this.state.subs[key] = []; 
        }
        this.state.subs[key].push(callback);
    }

    unsubscribe(key, callback){
        if(this.state.subs.hasOwnProperty(key)){
            let index = this.state.subs[key].indexOf(callback);
            if(index >= 0){
                this.state.subs[key].slice(index, 1);
            }
        }
    }

    once(key, callback){
        if(!this.state.once.hasOwnProperty(key)){
            this.state.once[key] = []; 
        }
        this.state.once[key].push(callback);
    }

    ack(key, callback){
        if(!this.state.ack.hasOwnProperty(key)){
            this.state.ack[key] = []; 
        }
        this.state.ack[key].push(callback);
    }

    ack_once(key, callback){
        if(!this.state.ack_once.hasOwnProperty(key)){
            this.state.ack_once[key] = []; 
        }
        this.state.ack_once[key].push(callback);
    }

    registerInitHook(callback){
        if(!this.state.inited){
            this.state.init_hooks.push(callback);
        }
        else{
            callback();
        }
    }

    prepareSend(payload, broadcast){
        broadcast = broadcast || false;
        payload.broadcast = broadcast;

        payload.id = this.state.id;

        return payload
    }

    send(payload, broadcast){
        payload = this.prepareSend(payload, broadcast)
        this.ws.send(JSON.stringify(payload));
    }

    sendBulk(payloads, broadcast){
        let prepared_payloads = [];
        for(let payload of payloads){
            prepared_payloads.push(
                this.prepareSend(payload, broadcast));
        }
        this.send({ frames: prepared_payloads, key: "bulk", type: "command"}, broadcast);
    }

    resetConnection(){
        if (this.state.reset_timer === null){
            this.state.reset_timer = setInterval(() => {
                console.log("Attempting to reconnect...");
                console.log(this.state.reset_timer);
                this.init(this.state.factory, this.state.ip, this.state.port);
            }, 5000);
        }
    }
}

const ws_client = new WebSocketClient();
ws_client.init(Host, "8081");

export default ws_client
