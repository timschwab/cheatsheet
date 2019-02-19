// Library includes
const {app, BrowserWindow, Menu} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

// Electron infrastructure
const menu = require('./server/menu')
const routes = require('./server/routes')

// Connect to redis and set up the main window
function main() {
	// Connect to redis
	let client = redis.createClient()

	// Set up routes
	routes.init(client)

	// Create main window
	let win = new BrowserWindow({width: 800, height: 600})
	Menu.setApplicationMenu(menu)
	win.loadFile('client/index.html')
}

// Start app
app.on('ready', main)
