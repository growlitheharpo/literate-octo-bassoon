'use strict'

const { getFiles, parseTag } = require("./Utils")
const { sequelize, Song, Album, Artist } = require('./Database')

class Library {
    constructor() {
        this.root = ""

        /*
        db.songs.find().then((vals) => {
            this.songs = vals
        })
        */
    }

    getSongs() {
        return this.songs || []
    }

    async loadSingleSong(tagObj, filePath) {
        let t = tagObj.tags
        if (t === undefined) {
            return
        }

        // TODO: Check for necessary tags!

        try {
            let [artist, artistCreated] = await Artist.findOrCreate({ 
                where: { name: t.artist } 
            })
            let [album, albumCreated] = await Album.findOrCreate( { 
                where: { title: t.album, artistId: artist.id }, 
                defaults: {
                    title: t.album,
                    year: t.year,
                    ArtistId: artist.id
                }
            })
            let [song, songCreated] = await Song.findOrCreate( { 
                where: { file: filePath }, 
                defaults: {
                    AlbumId: album.id,
                    title: t.title,
                    track: t.track,
                    file: filePath
            }})

            if (song == undefined) {
                throw "bad error";
            }
        } catch (error) {
            console.log(error)
        }
        

        /*
        const newSong = new Song()
        newSong.loadFromTag(t, filePath)

        let songs = this.getSongs()
        if (((songs.filter((song) => newSong.isDuplicate(song))) || []).length > 0) {
            return
        }

        /*
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
        */
    }

    async initialize(root) {
        this.root = root

        let allFiles = await getFiles(this.root)
        await allFiles.reduce(async (p, filePath) => {
            await p;
            let tagObj = await parseTag(filePath)
            return this.loadSingleSong(tagObj, filePath)
        }, Promise.resolve())
    }
}

module.exports = Library
