import os
import json

import youtube_utils as yt


def search(client, req):
    params = [ "query" ]
    if not valid_params(params, req, client):
        return False

    yt_response = yt.search(req["details"]["query"])

    client.sendTarget(req["id"], key="get.search", payload={"payload": yt_response})

    return True


def toggle_play_pause(client, req):
    client.setState("playing", not client.getState("playing"))
    client.sendTarget(req["id"], type="acknowledge", key="get.search", payload={})

    return True


def get_play_pause(client, req):
    client.sendTarget(req["id"], key="get.play_pause", payload={
        "playing": client.getState("playing")
    })

    return True

def add_queue(client, req):

    params = [
        "id"
    ]

    if not valid_params(params, req, client):
        return False

    # get full video details
    video = yt.get_video(req["details"]["id"])

    if not video:
        pass # TODO implement exception

    q = client.getState("queue")
    q.append(video)
    client.setState("queue", q)

    client.send(key="get.queue", type="broadcast", payload={"payload": q})

    return True

def get_queue(client, req):
    client.sendTarget(req["id"], payload={
        "key": "get.queue",
        "payload": client.getState("queue")
    })


## Helpers

def valid_params(params, req, client):
    for p in params:
        if p not in req["details"]:
            client.sendTarget(
                req["id"],
                type="error",
                key=req["key"],
                payload={"msg": "Request details missing \"%s\"" % p})
            return False
    return True


##########################
# Handlers               #
##########################

handlers = {
    "get.search": [search],

    "toggle.play_pause": [toggle_play_pause],
    "get.play_pause": [get_play_pause],

    "add.queue": [add_queue],
    "get.queue": [get_queue]

}
