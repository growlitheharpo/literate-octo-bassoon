const { app } = require('electron')
const storage = require('nedb-promises')

const dbFactory = (filename) => storage.create({
    filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/database/${filename}`,
    timestampData: true,
    autoload: true
})

const db = {
    albums: dbFactory('album.db'),
    songs: dbFactory('songs.db'),
}

module.exports = db
