
import subprocess
import sys
import re
import os
import math


volume_scale = 0.70


def set_volume(value):
    if os.name == "posix":
        return
    result = subprocess.run(["amixer", "-M", "set", "Master", "{}%".format(math.floor(value * volume_scale))], stdout=subprocess.PIPE)


def get_volume():
    if os.name == "posix":
        return 0
    result = subprocess.run(["amixer", "-M", "get", "Master"], stdout=subprocess.PIPE)
    matches = re.findall("[0-9]{1,3}%", str(result.stdout))
    vol =  math.floor(int(matches[0].replace("%","")) / volume_scale)
    return vol
