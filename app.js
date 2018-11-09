const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

const queryHandler = require('./server/query.js')

let win
let client

// Connect to redis and set up the main window
function main() {
	// Connect to redis
	client = redis.createClient()

	// Create main window
	win = new BrowserWindow({width: 800, height: 600})
	win.loadFile('client/index.html')
}

ipcMain.on('query', (event, q) => {queryHandler(event, client, q)})
app.on('ready', main)

