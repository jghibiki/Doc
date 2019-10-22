import sys
import random
from datetime import datetime, timedelta
import asyncio

import isodate
import requests


import youtube_utils as yt
import filters


manual_filters = [ i.upper() for i in filters.manual ]
magic_mode_filters = [ i.upper() for i in filters.magic_mode ]

today = datetime.now()

def filter_videos(videos, magic_mode=False):

    if type(videos) == list:
        valid_videos = []
        for vid in videos:
            failed = any([ f in vid["title"].upper() for f in manual_filters])

            if magic_mode and not failed:
                failed = any([f in vid["title"].upper()
                    for f in magic_mode_filters])

            if not failed:
                valid_videos.append(vid)
        return valid_videos

    else:
        for f in manual_filters:
            if f in videos["title"].upper():
                return False
        if magic_mode:
            for f in magic_mode_filters:
                if f in videos["title"].upper():
                    return False
        return True

def start_server_logic(loop, client):

    print("Initializing Server Logic")

    # client.state initialization
    client.state["playing"] = True
    client.state["current_song"] = None
    client.state["playback_timer"] = None
    client.state["magic_mode"] = True
    client.state["history"] = []
    client.state["magic_mode_history"] = []
    client.state["duration_limit"] = True
    client.state["last_refresh"] = datetime.now()

    loop.call_later(1, lambda: server_loop(loop, client))

def check_killswitch(loop):
    response = requests.get('http://jghibiki.github.io/Doc/ks.txt')


    print(response.status_code)

    if response.status_code == 404:
        print("Doc has been disabled. Attempts to remove this killswitch will result in the removal of this probject from github, and no further support will be provided")
        sys.exit()

    loop.call_later(10 * 60, lambda: check_killswitch(loop))


def check_auto_pause(client):
    if client.state["playing"] and (today - datetime.now()).days > 0:
        client.state["playing"] = False
        client.sendAll(payload={
            "key": "get.play_pause",
            "payload": {"playing": False }
        })

def server_loop(loop, client):


    if client.state["playback_timer"] != None:

        if client.state["playback_timer"] < datetime.now():

            print("Playback of %s ended." % (client.state["current_song"]["title"][:40].ljust(40)))

            client.sendAll({"key": "set.skip"})

            client.state["playback_timer"] = None
            client.state["current_song"] = None
        else:
            print("Playing %s - remaining: %s" % ( client.state["current_song"]["title"][:40].ljust(40), (client.state["playback_timer"] - datetime.now()) ) )

    # check the last time the player was refreshed, if over 60 min, refresh and  wait a few seconds to reconnect
    if client.state["current_song"] == None and ( datetime.now() - client.state["last_refresh"]) > timedelta(minutes=40):
        print("Refreshing client")
        client.state["last_refresh"] = datetime.now()
        client.sendAll({"key": "trigger.refresh"})
        loop.call_later(4, lambda: server_loop(loop, client))
        return

    if client.state["current_song"] == None and client.state["playing"]:

        # play from queue
        if len(client.state["queue"]) > 0:
            # get first in queue
            song = client.state["queue"].pop(0)
            print(client.state["queue"])

            client.sendAll({"key":"remove.queue", "payload": {"id": song["id"] }})

            # verify video is valid

            if filter_videos(song):

                # parse out video duration and calculate video finish time
                duration = isodate.parse_duration(song["duration"])
                print("Parsed duration: {}".format(duration))

                if  not client.state["duration_limit"] or duration < timedelta(minutes=10):

                    song["played_at"] = datetime.now().strftime("%c")
                    client.state["current_song"] = song

                    client.state["playback_timer"] = duration + datetime.now()

                    client.state["current_song"]["ends_at"] = client.state["playback_timer"].strftime("%c")

                    print("Setting Current Song to : %s" % song["title"])
                    print("Playing until: %s" % client.state["playback_timer"])

                    # send to player/clients
                    client.sendAll({"key":"set.current_song", "payload": {"song": song}})

                    # send new queue
                    client.sendAll({"key":"get.queue", "payload": client.state["queue"]})

                    # add song to history
                    client.state["history"].append(song)
                    if filter_videos(song, magic_mode=True) and not hasattr(song, "auto_queued"):
                        client.state["magic_mode_history"].append(song)

                    client.sendAll({"key":"add.history", "payload": song})
                else:
                    print("Skipping - Video too long")
            else:
                print("Skipping - Invalid Video")

        elif client.state["magic_mode"] and len(client.state["queue"]) == 0 and len(client.state["magic_mode_history"]) > 0:

            print("Seeking related video...")

            # get random video from history
            options = list(filter(lambda e:not e.get("auto_queued", False), client.state["magic_mode_history"]))
            print("options", options)
            old_video = random.choice(options)

            # get related videos
            related_videos = yt.search_related_videos(old_video["id"])

            # filter related videos
            valid_videos = filter_videos(related_videos, magic_mode=True)

            if len(valid_videos) == 0:
                loop.call_later(1, lambda: server_loop(loop, client))
                return

            # choose related video
            new_video = random.choice(valid_videos[:10])

            video_not_recent = True
            for video in client.state["history"]:
                date = datetime.strptime(video["played_at"], "%c")
                if new_video["id"] == video["id"] and datetime.now() - date < timedelta(minutes=60):
                    print("Auto queued video {} rejected, played too recently".format(video["title"]))
                    video_not_recent = False
                    break

            if video_not_recent:

                # get video details
                video_details = yt.get_video(new_video["id"])

                # record parent and grandparents
                mm_history = old_video.get("magic_mode", [])
                if hasattr(old_video, "magic_mode"):
                    del old_video["magic_mode"]
                video_details["magic_mode"] = [ old_video, *mm_history ]

                # set auto_queued flag
                video_details["auto_queued"] = True

                print("Auto queuing %s" % video_details["title"][:20])

                # add video to queue
                client.state["queue"].append(video_details)

    loop.call_later(1, lambda: server_loop(loop, client))
