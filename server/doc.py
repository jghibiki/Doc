#!/bin/python
#
# This sciprt requires python 3 and requests
#
#   Install Requests:
#       sudo pip install requests
#

from broadcast_server import start_server

def main():
    start_server("0.0.0.0", 8081)


if __name__ == "__main__":
    main()
