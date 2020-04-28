'use strict'

const Song = require('./Song')
const Album = require('./Album')
const { getFiles, parseTag } = require("./Utils")
const db = require('./Database')

class Library {
    // root: string
    // albums: Album[]
    // songs: Song[]

    constructor() {
        this.root = ""
        db.songs.find().then((vals) => {
            this.songs = vals
        })
    }

    getSongs() {
        return this.songs || []
    }

    async loadSingleSong(tagObj, filePath) {
        let t = tagObj.tags
        if (t === undefined) {
            return
        }

        let newSong = new Song()
        newSong.loadFromTag(t, filePath)

        let songs = this.getSongs()
        if (((songs.filter((song) => newSong.isDuplicate(song))) || []).length > 0) {
            return
        }

        const albums = await db.albums.find({ title: newSong.album })
        let album;
        if ((albums || []).length === 0) {
            album = new Album()
            album.loadFromTag(t)
            album = await db.albums.insert(album)
        } else {
            album = albums[0]
        }

        newSong.albumId = album._id
        newSong = await db.songs.insert(newSong)
        songs.push(newSong)
    }

    async initialize(root) {
        this.root = root

        await getFiles(this.root)
        .then((allFiles) => {
            return allFiles.map((filePath) => {
                if ((this.getSongs().filter((song) => song.file === filePath) || []).length > 0) {
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
