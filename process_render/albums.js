'use strict'

const { ipcRenderer } = require('electron')
const { findTemplate } = require('../modules/Utils')

const links = document.querySelectorAll('link[rel="import"]')

ipcRenderer.on('clear-albums', () => {
    const listElement = document.getElementById('album-cover-list')
    if (listElement) {
        listElement.innerHTML = ''
    }
})

ipcRenderer.on('append-to-album-list', (event, albumList) => {
    const listElement = document.getElementById('album-cover-list')
    const template = findTemplate(links, ".album-cover-template")

    if (listElement && template) {
        albumList.forEach((album) => {
            const clone = document.importNode(template.content, true)
            const img = clone.querySelector('.album-cover-img')
            if (img != null) {
                img.src = `data:${album.artworkFmt};base64,${album.artwork}`;
            }
            const title = clone.querySelector('.album-cover-title')
            if (title != null) {
                title.innerHTML = album.title.replace(/\//g, '/<wbr>')
            }
            const artist = clone.querySelector('.album-cover-artist')
            if (artist != null) {
                artist.innerHTML = album.artist
            }
            listElement.appendChild(clone)
        })
    }
})
