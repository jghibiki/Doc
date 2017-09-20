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

    if client.getState("playing"):
        print("Resumed playback")
    else:
        print("Paused playback")

    client.sendTarget(req["id"], type="acknowledge", key="get.search", payload={})

    return True


def get_play_pause(client, req):
    client.sendTarget(req["id"], key="get.play_pause", payload={
        "payload": {"playing": client.getState("playing") }
    })

    return True

def add_queue(client, req):

    params = [
        "id"
    ]

    if not valid_params(params, req, client):
        return False

    # validate we don't already have this video
    q = client.getState("queue")

    for v in q:
        if req["details"]["id"] == v["id"]:
            return False

    # get full video details
    video = yt.get_video(req["details"]["id"])

    if not video:
        pass # TODO implement exception

    # flag video as not autoqueued
    video["auto_queued"] = False

    q.append(video)
    client.setState("queue", q)

    #client.send(key="get.queue", type="broadcast", payload={"payload": q})

    return True

def get_queue(client, req):
    client.sendTarget(req["id"], key="get.queue", payload={"payload": client.getState("queue")})

    return True

def get_current_song(client, req):
    client.sendTarget(req["id"], key="get.current_song", payload={"payload": client.getState("current_song")})

    return True

def set_skip(client, req):
    print("Skipping Song")
    client.setState("current_song", None)
    client.setState("playback_timer", None)

    return True



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
    "get.queue": [get_queue],

    "get.current_song": [get_current_song],

    "set.skip": [set_skip]
}
