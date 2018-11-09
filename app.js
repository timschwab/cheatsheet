const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

const queryHandler = require('./server/query.js')
const addHandler = require('./server/add.js')

let win
let client

// Connect to redis and set up the main window
function main() {
	// Connect to redis
	client = redis.createClient()

	// Create main window
	win = new BrowserWindow({width: 800, height: 600})
	win.loadFile('client/search.html')
	//Menu.setApplicationMenu(null)
}

ipcMain.on('query', (event, q) => {queryHandler(event, client, q)})
ipcMain.on('add', (event, data) => {addHandler(event, client, data)})
app.on('ready', main)

