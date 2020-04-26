'use strict'

const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises
const jsmediatags = require('jsmediatags')
const crypto = require('crypto')

let mainWin;
let parsedImgs = new Object()

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

function getFiles(dir) {
    return fs.readdir(dir)
    .then((subdirs) => {
        return Promise.all(subdirs.map((subdir) => {
            const res = path.resolve(dir, subdir)
            return fs.stat(res).then((statRes) => {
                return statRes.isDirectory() ? getFiles(res) : Promise.resolve(res)
            })
        }))
    }).then((files) => {
        return Promise.resolve(files.reduce((a, f) => a.concat(f), []))
    })
}

ipcMain.on('open-folder', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    .then((result) => {
        if (result && result.filePaths && result.filePaths.length > 0) {
            let dir = result.filePaths[0]
            return getFiles(dir)
        } else {
            return Promise.resolve([])
        }
    })
    .then((files) => {
        return Promise.all(files.map((filePath) => {
            return new Promise((resolve, reject) => {
                new jsmediatags.Reader(filePath)
                    .read({
                        onSuccess: (tag) => {
                            resolve(tag)
                        },
                        onError: (error) => {
                            resolve({})
                        }
                    })
            })
        }))
    })
    .then((tags) => {
        let imgs = tags
        .filter((obj) => {
            return obj.hasOwnProperty('tags') && obj.tags.hasOwnProperty('picture')
        })
        .map((obj) => {
            var imgData = obj.tags.picture

            var buffer = new Buffer(imgData.data)
            var str = buffer.toString('base64')

            const shasum = crypto.createHash('md5')
            shasum.update(str)
            const hash = shasum.digest('hex')
            if (parsedImgs.hasOwnProperty(hash)) {
                return parsedImgs[hash]
            }

            parsedImgs[hash] = `data:${imgData.format};base64,${str}`;
            return parsedImgs[hash]
        })

        function distinct (val, index, self) {
            return self.indexOf(val) == index
        }
        imgs = imgs.filter(distinct)
        event.sender.send('add-folder-images', imgs)
    });
})
