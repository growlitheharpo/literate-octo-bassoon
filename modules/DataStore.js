'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor(settings) {
        super(settings)

        this.todos = this.get('todos') || []
    }

    saveTodos() {
        this.set('todos', this.todos)
        return this // fluid API
    }

    getTodos() {
        this.todos = this.get('todos') || []
        return this // fluid API
    }

    addTodo(todo) {
        this.todos = [ ...this.todos, todo ]
        return this.saveTodos()
    }

    deleteTodo(todo) {
        this.todos = this.todos.filter(t => t !== todo)
        return this.saveTodos()
    }
}

module.exports = DataStore
