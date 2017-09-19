
from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser

DEVELOPER_KEY = "AIzaSyAPLpQrMuQj6EO4R1XwjwS2g47dqpFXW3Y"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


def search(query):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)


    search_response = youtube.search().list(
        q=query,
        part="id,snippet",
        maxResults=50
    ).execute()

    videos = []
    channels = []
    playlists = []

    # Add each result to the appropriate list, and then display the lists of
    # matching videos, channels, and playlists.
    for search_result in search_response.get("items", []):
        if search_result["id"]["kind"] == "youtube#video":
            videos.append({
                "title": search_result["snippet"]["title"],
                "id": search_result["id"]["videoId"],
                "uploader": search_result["snippet"]["channelTitle"],
                "description": search_result["snippet"]["description"],
                "thumbnail": search_result["snippet"]["thumbnails"]["high"],
                "url": "https://www.youtube.com/embed/" + search_result["id"]["videoId"],
                "autoplay_url": "https://www.youtube.com/embed/" + search_result["id"]["videoId"] + "?autoplay=1"

            })

    return videos

def get_video(yt_id):

    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

    response = youtube.videos().list(
        part="id,snippet",
        id=yt_id
    ).execute()

    #print(response)

    response = response.get("items", [None])[0]

    if not response:
        return None

    video = {
        "title": response["snippet"]["title"],
        "id": response["id"],
        "uploader": response["snippet"]["channelTitle"],
        "description": response["snippet"]["description"],
        "thumbnail": response["snippet"]["thumbnails"]["high"],
        "url": "https://www.youtube.com/embed/" + response["id"],
        "autoplay_url": "https://www.youtube.com/embed/" + response["id"] + "?autoplay=1"
    }

    #print(video)

    return video

