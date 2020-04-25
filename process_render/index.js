'use strict'

const { ipcRenderer } = require('electron')

const deleteTodo = (event) => {
    ipcRenderer.send('delete-todo', event.target.textContent)
}

document.getElementById('create-todo-btn').addEventListener('click', () => {
    ipcRenderer.send('add-todo-window')
})

ipcRenderer.on('todos', (event, todos) => {
    const todoList = document.getElementById('todo-list')
    const todoItems = todos.reduce((html, todo) => {
        html += `<li class="todo-item">${todo}</li>`
        return html
    }, '')

    todoList.innerHTML = todoItems
    todoList.querySelectorAll('.todo-item').forEach(item => {
        console.log("clicked click clack")
        item.addEventListener('click', deleteTodo)
    })
})
