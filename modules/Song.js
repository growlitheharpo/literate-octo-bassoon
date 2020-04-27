'use strict'

class Song {
    loadFromTag(tag, path) {
        this.file = path
        this.title = tag.title
        this.artist = tag.artist
        this.track = tag.track
        this.album = tag.album
        this.year = tag.year
    }

    isDuplicate(other) {
        return this.file === other.file
    }
}

module.exports = Song
