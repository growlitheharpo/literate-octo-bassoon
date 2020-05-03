'use strict'

const { ipcRenderer } = require('electron')

ipcRenderer.on('begin-loading', (event) => {
    document.getElementById('loader-screen').classList.remove("hidden")
    document.getElementById("primary-container").classList.add("hidden")

    document.getElementById('loader-screen-header').innerHTML = "Loading..."
    document.getElementById('loader-screen-info').innerHTML = ""
    document.getElementById('loader-screen-info-secondary').innerHTML = ""
})

ipcRenderer.on('set-loading-text', (event, payload) => {
    if (payload.header) {
        document.getElementById('loader-screen-header').innerHTML = payload.header
    }
    if (payload.info) {
        document.getElementById('loader-screen-info').innerHTML = payload.info

        if (payload.secondary) {
            document.getElementById('loader-screen-info-secondary').innerHTML = payload.secondary
        }
    }
    if (payload.progress) {
        document.getElementById('loader-screen-progress').style.width = (payload.progress * 100) + "%"
    }
})

ipcRenderer.on('finish-loading', (event) =>{
    document.getElementById('primary-container').classList.remove("hidden")
    document.getElementById('loader-screen').classList.add("hidden")
})
