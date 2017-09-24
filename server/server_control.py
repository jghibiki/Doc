import random
from datetime import datetime, timedelta

import isodate

import youtube_utils as yt

# list of video titles to filter
filter_list = [
    "watch mojo",
    "top 5",
    "top 10",
    "top 25",
    "kids react",
    "youtubers react",
    "celebs react",
    "cats react"
    "s react",
    "lets play",
    "let's play",
    "letz play",
    "lest play",
    "let play"
    "letsplay",
    "reaction"
]

filter_list = [ i.upper() for i in filter_list ]

def filter_videos(videos):

    if type(videos) == list:
        valid_videos = []
        for vid in videos:
            for f in filter_list:
                if f in vid["title"].upper():
                    continue
            valid_videos.append(vid)
        return valid_videos

    else:
        for f in filter_list:
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
    client.state["duration_limit"] = True

    loop.call_later(1, lambda: server_loop(loop, client))


def server_loop(loop, client):

    if client.state["playback_timer"] != None:

        if client.state["playback_timer"] < datetime.now():

            print("Playback of %s ended." % (client.state["current_song"]["title"][:40].ljust(40)))

            client.sendAll({"key": "set.skip"})

            client.state["playback_timer"] = None
            client.state["current_song"] = None
        else:
            print("Playing %s - remaining: %s" % ( client.state["current_song"]["title"][:40].ljust(40), (client.state["playback_timer"] - datetime.now()) ) )

    if client.state["current_song"] == None and client.state["playing"]:

        # play from queue
        if len(client.state["queue"]) > 0:
            # get first in queue
            song = client.state["queue"].pop(0)

            client.sendAll({"key":"remove.queue", "payload": {"id": song["id"] }})

            # verify video is valid

            if filter_videos(song):

                client.state["current_song"] = song

                # parse out video duration and calculate video finish time
                duration = isodate.parse_duration(song["duration"])

                if  not client.state["duration_limit"] or duration < timedelta(minutes=10):

                    client.state["playback_timer"] = duration + datetime.now()

                    print("Setting Current Song to : %s" % song["title"])
                    print("Playing until: %s" % client.state["playback_timer"])

                    # send to player/clients
                    client.sendAll({"key":"set.current_song", "payload": {"song": song}})

                    # send new queue
                    client.sendAll({"key":"get.queue", "payload": client.state["queue"]})

                    # add song to history
                    client.state["history"].append(song)

                    client.sendAll({"key":"add.history", "payload": song})
            else:
                print("Skipping - Invalid Video")

        elif client.state["magic_mode"] and len(client.state["queue"]) == 0 and len(client.state["history"]) > 0:

            print("Seeking related video...")

            # get random video from history
            old_video = random.choice(client.state["history"])

            # get related videos
            related_videos = yt.search_related_videos(old_video["id"])

            # filter related videos
            valid_videos = filter_videos(related_videos)

            # choose related video
            new_video = random.choice(valid_videos)

            # get video details
            video_details = yt.get_video(new_video["id"])

            # set auto_queued flag
            video_details["auto_queued"] = True

            print("Auto queuing %s" % video_details["title"][:20])

            # add video to queue
            client.state["queue"].append(video_details)


    loop.call_later(1, lambda: server_loop(loop, client))
