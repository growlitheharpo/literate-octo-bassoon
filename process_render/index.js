'use strict'

const { ipcRenderer } = require('electron')
const { Howl, Howler } = require('howler')

document.getElementById('play-sound-btn').addEventListener('click', () => {
    ipcRenderer.send('play-song')
})

document.getElementById('volume-slider').oninput = function() {
    const v = this.value
    Howler.volume(v / 100.0)
}

document.getElementById('open-folder-btn').addEventListener('click', () => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.on('clear-albums', () => {
    const listElement = document.getElementById('album-cover-list')
    if (listElement) {
        listElement.innerHTML = ''
    }
})

ipcRenderer.on('add-folder-images', (event, imageList) => {
    const listElement = document.getElementById('album-cover-list')
    if (listElement) {
        const listItems = imageList.reduce((html, txt) => {
            html += `<img src=${txt} />`
            return html
        }, listElement.innerHTML)

        listElement.innerHTML = listItems
    }

    /*
    const todoList = document.getElementById('todo-list')
    const todoItems = todos.reduce((html, todo) => {
        html += `<li class="todo-item">${todo}</li>`
        return html
    }, '')

    todoList.innerHTML = todoItems
    todoList.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', deleteTodo)
    })
    */
})

let sound;
let soundTick;

function soundCleanup() {
    sound = null
    window.clearInterval(soundTick)
}

ipcRenderer.on('use-sound-file', (event, filepath) => {
    if (sound) {
        sound.stop()
        soundCleanup()
    }

    sound = new Howl({
        src: [ filepath ],
        onend: soundCleanup
    })

    soundTick = window.setInterval(() => {
        const visSlider = document.getElementById('sound-progress')
        const newVal = sound.seek() || 0
        const maxVal = sound.duration() || 1
        visSlider.style.width = ((newVal / maxVal) * 100) + "%"
    }, 100)

    sound.play()
})
