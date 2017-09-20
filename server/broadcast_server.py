from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory

import os
import json


from jsoncomment import JsonComment
jsonParser = JsonComment(json)

import subscriptions
from server_control import start_server_logic

class BroadcastServerProtocol(WebSocketServerProtocol):

    def __init__(self, *args, **kwargs):
        super(WebSocketServerProtocol, self).__init__(*args, **kwargs)

        print("init")

        self.clients = []

    def onOpen(self):
        self.factory.register(self)

    def onConnect(self, client):
        print("Client connecting: {}".format(client.peer))
        self.clients.append(client)


    def onMessage(self, payload, isBinary):

        # deserialize json
        obj = json.loads(payload.decode("utf8"))

        if("BROADCAST_DEBUG" in os.environ
            and os.environ["BROADCAST_DEBUG"]):
            print(obj["type"], obj["key"] if "key" in obj else None)


        success = False #don't allow a broadcast on a bad handle

        if(obj["type"] == "ping"):
            self.send({"type": "pong"})
            success = True

        elif(obj["type"] == "register"):
            self.register(obj["id"])
            success = True

        elif(obj["type"] == "command" and obj["key"] != "bulk"):
            if(obj["key"] in subscriptions.handlers):
                for handler in subscriptions.handlers[obj["key"]]:
                    success = handler(self, obj) or success

        elif(obj["type"] == "command" and obj["key"] == "bulk"):
            if "frames" in obj:
                success = True
                for frame in obj["frames"]:
                    if(frame["key"] in subscriptions.handlers):
                        for handler in subscriptions.handlers[frame["key"]]:
                            handler(self, frame)
            else:
                client.sendTarget(
                        req["id"],
                        type="error",
                        key="modify.map.fow",
                        payload={"msg": "Request details missing \"x\""})

        # if broadcast == true broadcast to all
        if("broadcast" in obj
            and obj["broadcast"]
            and success):
            self.broadcast(obj)

    def connectionLost(self, reason):
        WebSocketServerProtocol.connectionLost(self, reason)
        self.factory.unregister(self)

    def register(self, id):
        self.clients.append(id)

    def broadcast(self, payload):
        self.send(payload, type="broadcast")

    def sendTarget(self, target, type="broadcast_target", key="", payload={}):
        payload["targets"] = [target]
        self.send(payload, type, key=key, isResponse=True)

    def send(self, payload, type=None, key=None, isResponse=False):
        if type is not None:
            payload["type"] = type

        if key is not None:
            payload["key"] = key

        payload["is_response"] = isResponse

        if("BROADCAST_DEBUG" in os.environ
            and os.environ["BROADCAST_DEBUG"]):
            if payload["type"] == "error":
                print(payload["type"], payload["msg"])
            else:
                print(payload["type"], payload["key"] if "key" in payload else None)

        payload = json.dumps(payload, ensure_ascii=False).encode("utf8")

        if type == "broadcast":
            if("BROADCAST_DEBUG" in os.environ
                and os.environ["BROADCAST_DEBUG"]):
                print("broadcasting")
            self.factory.broadcast(payload)
        else:
            self.sendMessage(payload)

    def getState(self, key):
        return self.factory.state[key]

    def setState(self, key, value):
        self.factory.state[key] = value



class BroadcastServerFactory(WebSocketServerFactory):

    protocol = BroadcastServerProtocol


    def __init__(self):
        WebSocketServerFactory.__init__(self)

        self.state = {
            "current_song": None,
            "queue": [],
            "playing": True,
            "magic_mode": True
        }

        self.clients = []


    def register(self, client):
        if client not in self.clients:
            self.clients.append(client)

    def unregister(self, client):
        if client in self.clients:
            self.clients.remove(client)

    def sendAll(self, payload, type="broadcast", key=None, isResponse=False):
        for c in self.clients:
            c.send(payload, type, key, isResponse)

    def broadcast(self, payload):
        for c in self.clients:
            c.sendMessage(payload)




def start_server(host, port):

   try:
      import asyncio
   except ImportError:
      ## Trollius >= 0.3 was renamed
      import trollius as asyncio


   factory = BroadcastServerFactory()

   loop = asyncio.get_event_loop()
   coro = loop.create_server(factory, host, port)
   server = loop.run_until_complete(coro)

   loop.call_later(1, lambda: start_server_logic(loop, factory))

   try:
      loop.run_forever()
   except KeyboardInterrupt:
      pass
   finally:
      server.close()
      loop.close()
