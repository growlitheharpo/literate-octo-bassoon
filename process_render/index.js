'use strict'

const { ipcRenderer } = require('electron')
const { Howl, Howler } = require('howler')
const { findTemplate } = require('../modules/Utils')

const links = document.querySelectorAll('link[rel="import"]')

function addTemplate(templateName, parentSelector) {
    const template = findTemplate(links, templateName)
    if (template == null) {
        console.error("Could not find template " + templateName)
        return null
    } else {
        const clone = document.importNode(template.content, true)
        return document.querySelector(parentSelector).appendChild(clone)
    }
}

const loader = addTemplate(".loader-template", ".loader-container")
const player = addTemplate(".player-template", "body")
const albums = addTemplate(".albums-template", ".container")

document.getElementById('open-folder-btn').addEventListener('click', () => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.send('index-ready')
