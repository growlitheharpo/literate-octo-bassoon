const { app } = require('electron')
const { Sequelize, DataTypes, Model } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/database/database.sqlite`,
    retry: 20,
})

class Song extends Model {}
Song.init({
    file: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    track: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize })

class Album extends Model {}
Album.init({
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    artwork: {
        type: DataTypes.BLOB,
    }
}, { sequelize })

class Artist extends Model {}
Artist.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, { sequelize })

Artist.hasMany(Album)
Album.belongsTo(Artist, {
    foreignKey: {
      allowNull: false
    }
})

Album.hasMany(Song)
Song.belongsTo(Album, {
    foreignKey: {
      allowNull: false
    }
})

module.exports = {
    Song,
    Album,
    Artist,
    sequelize,
}
