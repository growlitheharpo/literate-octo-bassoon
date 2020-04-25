const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const glob = require('glob')

let win
function createWindow() {
    loadMainScripts()

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL(url.format ({ 
        pathname: path.join(__dirname, 'index.html'), 
        protocol: 'file:',
        slashes: true 
     })) 
}

function loadMainScripts() {
    const files = glob.sync(path.join(__dirname, 'process-main/**.js'))
    files.forEach((file) => { require(file) })
}

app.on('ready', createWindow)
