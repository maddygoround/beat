# Beat
A terminal based audio player

![screenshot](./resources/beat.png)

## Features

* Supports mp3, flac, wav formats
* Displays metadata
* Volume controls
* Ability to play and pause audio

## Installation

    npm install -g beat

This will install beat.

## Usage

To open all audio files in folder: 

    beat /path/to/folder/
    
If used without path parameter, beat will assume current directory as default music folder

## Used libraries

* [ink](https://github.com/gizak/termui/)
* [node-lame](https://github.com/faiface/beep)
* [speaker](https://github.com/dhowden/tag/)
* [pcm-volume](https://github.com/dhowden/tag/)

## License
MIT