
import subprocess
import sys
import re
import os
import math


linux_volume_scale = 0.70
mac_volumme_scale = 1.0



def set_volume(value):
    if sys.platform == "darwin":
        subprocess.check_output("osascript -e 'set volume output volume {}'".format(value), shell=True)
    else:
        result = subprocess.run(["amixer", "-M", "set", "Master", "{}%".format(math.floor(value * linux_volume_scale))], stdout=subprocess.PIPE)


def get_volume():
    if sys.platform == "darwin":

        result = subprocess.check_output("osascript -e 'output volume of (get volume settings)'", shell=True)
        print(result)
        return int(result)
    else:
        result = subprocess.run(["amixer", "-M", "get", "Master"], stdout=subprocess.PIPE)
        matches = re.findall("[0-9]{1,3}%", str(result.stdout))
        vol =  math.floor(int(matches[0].replace("%","")) / linux_volume_scale)
        return vol
