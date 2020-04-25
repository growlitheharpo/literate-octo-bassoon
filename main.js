"use strict"

const { app, ipcRenderer } = require('electron')
const Window = require('./modules/Window')

const evts = require('./process_main/events')

function main() {
    let mainWindow = new Window({
        file: 'render/index.html'
    })

    mainWindow.on('show', () => {
        evts.initialize(mainWindow)
    })
}

app.on('ready', main)
app.on('window-all-closed', () => {
    app.quit()
})

