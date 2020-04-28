'use strict'

class Album {
    loadFromTag(tag) {
        this.title = tag.album
        this.artist = tag.artist
        this.albumId = ""
        this.year = tag.year
    }
}

module.exports = Album
