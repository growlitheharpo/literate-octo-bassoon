'use strict'

const { ipcRenderer } = require('electron')

document.getElementById('todo-form').addEventListener('submit', (event) => {
    event.preventDefault()

    const input = event.target[0]
    ipcRenderer.send('add-todo', input.value)
    input.value = ''
    window.close()
})
