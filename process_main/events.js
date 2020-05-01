'use strict'

const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises
const jsmediatags = require('jsmediatags')
const crypto = require('crypto')

const Library = require('../modules/Library')

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
    event.sender.send('clear-albums')

    dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    .then((result) => {
        if (result && result.filePaths && result.filePaths.length > 0) {
            let dir = result.filePaths[0]
            return library.addFolder(dir)
            // return getFiles(dir)
        } else {
            return Promise.resolve([])
        }
    })
    /*
    .then((files) => {
        return files.map((filePath) => {
            return new Promise((resolve, reject) => {
                new jsmediatags.Reader(filePath)
                    .read({
                        onSuccess: (res) => {
                            if (res.hasOwnProperty('tags') && res.tags.hasOwnProperty('picture')) {
                                var imgData = res.tags.picture

                                var buffer = new Buffer(imgData.data)
                                var str = buffer.toString('base64')

                                const shasum = crypto.createHash('md5')
                                shasum.update(str)
                                const hash = shasum.digest('hex')
                                if (!parsedImgs.hasOwnProperty(hash)) {
                                    parsedImgs[hash] = `data:${imgData.format};base64,${str}`;
                                }

                                event.sender.send('add-folder-images', [ parsedImgs[hash] ])
                            }
                            resolve()
                        },
                        onError: (error) => {
                            reject(error)
                        }
                    })
            })
        })
    })
    .then((promises) => {
        return Promise.all(promises)
    })
    */
})
