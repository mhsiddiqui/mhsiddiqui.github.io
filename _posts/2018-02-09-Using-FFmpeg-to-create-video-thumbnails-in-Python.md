---
layout: post
title:  "Using FFmpeg to create video thumbnails in Python"
date:   2018-02-09
image:  
tags:   [Python, FFmpeg, Thumbnail]
---

FFmpeg is A complete, cross-platform solution to record, convert and stream audio and video. You can download it from here and install it by following this link for your platform. Detailed documentation of FFmpeg can be seen here. In this post, I will discuss how to user FFmpeg with Python.

<!--more-->

## Installation

### Ubuntu
On Ubuntu, you can install by running following command

``` bash
sudo apt-get install ffmpeg
```

### Windows/Mac
You can download and install you OS specific binaries from [link](https://ffmpeg.org/download.html).

## Creating Thumbnail

Python have a wrapper for FFmpeg called FFmpy. You can see its documentation here. You can install it by running following command.

``` bash
pip install ffmpy
```

The command to use FFmpeg to create thumbnail of a video is below

``` bash
ffmpeg -i input.mp4 -ss 00:00:04 -vframes 1 output.png
```

1. input.mp4 is input video
2. 00:00:04 is the position of thumbnail in video
3. -vframes 1 shows number of frames you want to get
4. output.png is the output image at provided position

This command can be converted into python by following code.

``` python
from ffmpy import FFmpeg

ff = FFmpeg(inputs={'input.mp4': None}, outputs={"output.png": ['-ss', '00:00:4', '-vframes', '1']})

print ff.cmd

# Print result
# ffmpeg -i input.mp4 -ss 00:00:10 -vframes 1 output.png

ff.run()
```

In the above command, one frame was created. If you want to get multiple frames, you can use following command.

``` bash
ffmpeg -i input.mp4 -vf fps=1 out%d.png
```
1. -vf fps=1 mean create frame after one minute

This will be done in python like this

``` python
from ffmpy import FFmpeg

ff = FFmpeg(inputs={'input.mp4': None}, outputs={"out%d.png": ['-vf', 'fps=1']})

print ff.cmd

# Print result
#ffmpeg -i input.mp4 -vf fps=1 out%d.png

ff.run()
```

## Conclusion

With above mentioned way of extracting video thumbnail using FFmpeg with python wrapper, we can run many more commands.
