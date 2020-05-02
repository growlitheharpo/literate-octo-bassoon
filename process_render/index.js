'use strict'

const { ipcRenderer } = require('electron')
const { Howl, Howler } = require('howler')
const { findTemplate } = require('../modules/Utils')

const links = document.querySelectorAll('link[rel="import"]')

function addTemplate(templateName) {
    const template = findTemplate(links, templateName)
    if (template == null) {
        console.error("Could not find template " + templateName)
        return null
    } else {
        const clone = document.importNode(template.content, true)
        return document.querySelector('.container').appendChild(clone)
    }
}

const player = addTemplate(".player-template")
const albums = addTemplate(".albums-template")

document.getElementById('open-folder-btn').addEventListener('click', () => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.send('index-ready')
