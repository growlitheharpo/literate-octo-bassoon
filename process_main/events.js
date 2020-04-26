'use strict'

const { ipcMain, dialog } = require('electron')

let mainWin;
exports.initialize = function(win) {
    mainWin = win;
    mainWin.on('closed', () => {
        mainWin = null
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
