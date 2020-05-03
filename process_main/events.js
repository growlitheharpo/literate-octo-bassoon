'use strict'

const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises
const jsmediatags = require('jsmediatags')
const crypto = require('crypto')

const { Op } = require('sequelize')
const Library = require('../modules/Library')
const { Album, Artist, sequelize } = require('../modules/Database')

let mainWin;
let parsedImgs = new Object()
let library = new Library()

exports.initialize = function (win) {
    mainWin = win;
    mainWin.on('closed', () => {
        mainWin = null
        parsedImgs = null
    })
}

ipcMain.on('play-song', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then((filename) => {
        if (filename && filename.filePaths) {
            event.sender.send('use-sound-file', filename.filePaths[0] || "")
        }
    })
})

async function sendAllAlbums(event) {
    const limit = 10;
    let offset = 0
    while (true) {
        let albums = await Album.findAll( {
            where: {
                artwork: { [Op.not]: null}
            },
            include: [{
                model: sequelize.models.Artist,
                as: 'Artist',
                required: true
            }],
            order: [
                [ Album.associations.Artist, 'name', 'ASC'],
                ['year', 'ASC']
            ],
            offset,
            limit
        });

        offset += limit

        const data = albums.map((album) => {
            const artwork = album.artwork != null ? album.artwork.toString('base64') : ""
            return {
                artwork,
                artworkFmt: album.artworkFmt,
                artist: album.Artist.name,
                title: album.title,
                year: album.year.toString()
            }
        })
        event.sender.send('append-to-album-list', data)

        if (albums.length < limit) {
            break
        }
    }
}

ipcMain.on('index-ready', async (event) => {
    await sendAllAlbums(event)
    event.sender.send('finish-loading')
})

async function getFiles(dir) {
    let subdirs = await fs.readdir(dir)
    let files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir)
        const s = await fs.stat(res)
        return s.isDirectory() ? await getFiles(res) : res
    }))
    return files.reduce((a, f) => a.concat(f), [])
}

ipcMain.on('open-folder', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    .then((result) => {
        if (result && result.filePaths && result.filePaths.length > 0) {
            let dir = result.filePaths[0]
            event.sender.send('begin-loading')
            return library.addFolder(dir, (file, index, count) => {
                let progress = index / count
                event.sender.send('set-loading-text', {
                    header: "Parsing...",
                    info: `Loading file ${index} of ${count}`,
                    secondary: file,
                    progress
                })
            })
        } else {
            return Promise.resolve([])
        }
    })
    .then(() => {
        event.sender.send('clear-albums')
        return sendAllAlbums(event)
    })
    .then(() => {
        event.sender.send('finish-loading')
    })
})
