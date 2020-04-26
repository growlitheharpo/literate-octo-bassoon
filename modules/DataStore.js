'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor(settings) {
        super(settings)
    }
}

module.exports = DataStore
