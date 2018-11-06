const {app, BrowserWindow} = require('electron')
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

app.on('ready', main)
