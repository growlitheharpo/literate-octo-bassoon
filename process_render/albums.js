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

ipcRenderer.on('add-folder-images', (event, imageList) => {
    const listElement = document.getElementById('album-cover-list')
    const template = findTemplate(links, ".album-cover-template")

    if (listElement && template) {
        imageList.forEach((txt) => {
            const clone = document.importNode(template.content, true)
            const img = clone.querySelector('.album-cover-img')
            img.src = txt
            listElement.appendChild(clone)
        })
    }
})
