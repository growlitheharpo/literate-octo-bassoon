"use strict"

const { app, ipcRenderer } = require('electron')
const Window = require('./modules/Window')

const isDevelopment = process.env.NODE_ENV !== 'production'

function prepareCSS() {
    if (isDevelopment) {
        const Store = require('electron-store')
        const fs = require('fs')
        const store = new Store()
        const shasum = require('crypto').createHash('sha256')
        const input = fs.readFileSync('./assets/raw/base.css') + fs.readFileSync('./tailwind.config.js')
        shasum.update(input)

        const existingHash = store.get('tailwindhash')
        const newHash = shasum.digest('hex')
        if (existingHash !== newHash) {
            store.set('tailwindhash', newHash)
            require('child_process').execSync("npx tailwind build assets/raw/base.css -o assets/css/built.css")
        }
    }
}

const events = require('./process_main/events')

function main() {
    prepareCSS()

    let mainWindow = new Window({
        file: 'render/index.html'
    })

    mainWindow.on('show', () => {
        events.initialize(mainWindow)
    })
}

app.on('ready', main)
app.on('window-all-closed', () => {
    app.quit()
})
