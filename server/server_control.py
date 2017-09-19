from datetime import datetime

def start_server_logic(loop, client):

    print("Initializing Server Logic")

    # client.state initialization
    client.state["playing"] = True
    client.state["current_song"] = None
    client.state["playback_timer"] = None
    client.state["magic_mode"] = False
    client.state["history"] = []

    loop.call_later(1, lambda: server_loop(loop, client))


def server_loop(loop, client):

    #if client.state["playback_timer"] != None and client.state["playback_timer"] - datetime.now():

    #    # send skip command
    #    client.sendAll("set.skip");

    #    client.state["playback_time"] = None
    #    client.state["current_song"] = None

    print(len(client.state["queue"]))
    if client.state["current_song"] == None and len(client.state["queue"]) > 0:
        # get first in queue
        song = client.state["queue"].pop(0)
        client.state["current_song"] = song

        print("Setting Current Song to : %s" % song["title"])

        # send to player/clients
        client.sendAll(key="set.current_song", payload={"song": song})

        # send new queue
        client.sendAll(key="get.queue", payload={"payload": client.state["queue"]})

        # add song to history
        client.state["history"].append(song)


    loop.call_later(1, lambda: server_loop(loop, client))
