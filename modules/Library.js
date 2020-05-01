'use strict'

const { getFiles, parseTag } = require("./Utils")
const { sequelize, Song, Album, Artist } = require('./Database')

class Library {
    constructor() {
        this.root = ""
    }

    getSongs() {
        return this.songs || []
    }

    async loadSingleSong(tagObj, filePath) {
        let t = tagObj.tags
        if (t == null || t.artist == null || t.album == null || t.title == null) {
            return
        }

        try {
            let [artist, artistCreated] = await Artist.findOrCreate({ 
                where: { name: t.artist } 
            })
            let [album, albumCreated] = await Album.findOrCreate( { 
                where: { title: t.album, artistId: artist.id }, 
                defaults: {
                    title: t.album,
                    year: t.year || 1999,
                    ArtistId: artist.id
                }
            })
            let [song, songCreated] = await Song.findOrCreate( { 
                where: { file: filePath }, 
                defaults: {
                    AlbumId: album.id,
                    title: t.title,
                    track: t.track || 1,
                    file: filePath
            }})

            if (albumCreated) {
                var imgData = t.picture;
                if (imgData != null) {
                    var buffer = new Buffer(imgData.data)
                    await album.update({ artwork: buffer })
                }
            }

            if (song == undefined) {
                throw "bad error";
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addFolder(root) {
        this.root = root

        let allFiles = await getFiles(this.root)
        await allFiles.reduce(async (p, filePath) => {
            await p;

            // Look for it first - parsing the tag is a waste if it already exists
            let song = await Song.findOne({ where: { file: filePath } })
            if (song != null) {
                return Promise.resolve()
            }

            let tagObj = await parseTag(filePath)
            return this.loadSingleSong(tagObj, filePath)
        }, Promise.resolve())

        return this
    }
}

module.exports = Library
