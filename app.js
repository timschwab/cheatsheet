const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const redis = require('redis')

let win
let client

function main() {
    // Connect to redis
    client = redis.createClient()

    // Create main window
    win = new BrowserWindow({width: 800, height: 600})
    win.loadFile('html/index.html')
}

function query(event, q) {
    client.get(q, (err, result) => {
        event.sender.send('q-result', result)
    })
}

ipcMain.on('query', query)
app.on('ready', main)

