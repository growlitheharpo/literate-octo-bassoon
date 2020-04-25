'use strict'

const path = require('path')
const { ipcMain, TopLevelWindow } = require('electron')

const Window = require('../modules/Window')
const DataStore = require('../modules/DataStore')

const todosData = new DataStore({ name: 'Todos Main' })

let mainWin;
exports.initialize = function(win) {
    mainWin = win;
    mainWin.send('todos', todosData.getTodos().todos)
    mainWin.on('closed', () => {
        mainWin = null
    })
}

let addTodoWin;
ipcMain.on('initialize-once', () => {
    TopLevelWindow.getAllWindows().forEach((win) => {
        win.send('todos', updatedTodos)
    })
})

ipcMain.on('add-todo-window', () => {
    if (!addTodoWin) {
        addTodoWin = new Window({
            file: path.join(__dirname, '../render/add.html'),
            width: 400,
            height: 400,
            parent: mainWin,
            frame: false
        })

        addTodoWin.on('closed', () => {
            addTodoWin = null
        })
    }
})

ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos
    mainWin.send('todos', updatedTodos)
})

ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos
    mainWin.send('todos', updatedTodos)
})