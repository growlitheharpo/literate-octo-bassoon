'use strict'

const Song = require('./Song')
const { getFiles, parseTag } = require("./Utils")

class Album {}

class Library {
    // root: string
    // albums: Album[]
    // songs: Song[]

    constructor() {
        this.root = ""
    }

    getSongs() {
        return this.songs || []
    }

    async loadSingleSong(tagObj, filePath) {
        let t = tagObj.tags
        if (t === undefined) {
            return
        }

        const newSong = new Song()
        newSong.loadFromTag(t, filePath)

        let songs = this.getSongs()
        const dups = songs.filter((song) => {
            return (newSong.isDuplicate(song))
        })
        if (!dups || dups.length === 0) {
            songs.push(newSong)
        }
        this.songs = songs
    }

    async initialize(root) {
        this.root = root

        await getFiles(this.root)
        .then((allFiles) => {
            return allFiles.map((filePath) => {
                const dups = this.getSongs().filter((song) => {
                    return song.file === filePath
                })
                if (dups && dups.length > 0) {
                    return Promise.resolve()
                }

                return parseTag(filePath).then((tagObj) => {
                    return this.loadSingleSong(tagObj, filePath)
                })
            })
        })
        .then((promises) =>{
            Promise.all(promises)
        })
    }

    /*
    public getAlbumArt(albumName) {
    }
    */
}

module.exports = Library
