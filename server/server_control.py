from datetime import datetime

import isodate

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

    if client.state["playback_timer"] != None:

        if client.state["playback_timer"] < datetime.now():

            print("Playback of %s ended." % (client.state["current_song"]["title"][:20]))
            # send skip command
            # TODO determine usefulness of skipping
            client.sendAll(key="set.skip", payload={});

            client.state["playback_timer"] = None
            client.state["current_song"] = None
        else:
            print("Playing %s - remaining: %s" % ( client.state["current_song"]["title"][:20], (client.state["playback_timer"] - datetime.now()) ) )

    if client.state["current_song"] == None:

        # play from queue
        if len(client.state["queue"]) > 0:
            # get first in queue
            song = client.state["queue"].pop(0)
            client.state["current_song"] = song

            client.state["playback_timer"] = isodate.parse_duration(song["duration"]) + datetime.now()

            print("Setting Current Song to : %s" % song["title"])
            print("Playing until: %s" % client.state["playback_timer"])

            # send to player/clients
            client.sendAll(key="set.current_song", payload={"payload": {"song": song}})

            # send new queue
            client.sendAll(key="get.queue", payload={"payload": client.state["queue"]})

            # add song to history
            client.state["history"].append(song)

        elif client.state["magic_mode"] and len(client.state["queue"]) == 0:
            pass



    loop.call_later(1, lambda: server_loop(loop, client))
