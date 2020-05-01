const { app } = require('electron')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/database/database.sqlite`,
})

module.exports = {
    sequelize
}
