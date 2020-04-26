'use strict'

const { ipcRenderer } = require('electron')
const { Howl, Howler } = require('howler')

const deleteTodo = (event) => {
    ipcRenderer.send('delete-todo', event.target.textContent)
}

document.getElementById('create-todo-btn').addEventListener('click', () => {
    ipcRenderer.send('add-todo-window')
})

document.getElementById('play-sound-btn').addEventListener('click', () => {
    ipcRenderer.send('play-song')
})

document.getElementById('volume-slider').oninput = function() {
    const v = this.value
    Howler.volume(v / 100.0)
}

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

ipcRenderer.on('todos', (event, todos) => {
    const todoList = document.getElementById('todo-list')
    const todoItems = todos.reduce((html, todo) => {
        html += `<li class="todo-item">${todo}</li>`
        return html
    }, '')

    todoList.innerHTML = todoItems
    todoList.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', deleteTodo)
    })
})
