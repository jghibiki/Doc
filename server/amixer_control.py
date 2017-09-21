
import subprocess
import sys
import re
import math


volume_scale = 0.4


def set_volume(value):
    result = subprocess.run(["amixer", "-M", "set", "Master", "{}%".format(math.floor(value * volume_scale))], stdout=subprocess.PIPE)


def get_volume():
    result = subprocess.run(["amixer", "get", "Master"], stdout=subprocess.PIPE)
    matches = re.findall("[0-9]{1,3}%", str(result.stdout))
    return math.floor(int(matches[0].replace("%","")) * volume_scale)
