// Library includes
const {app, BrowserWindow, Menu} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

// Custom infrastructure
const menu = require('./server/menu')
const routes = require('./server/routes')
const api = require('./server/redis-api/api')

function main() {
	// Set up redis API
	api.init()

	// Set up routes
	routes.init()

	// Create main window
	let win = new BrowserWindow({width: 800, height: 600})
	Menu.setApplicationMenu(menu)
	win.loadFile('client/index.html')
}

// Start app
app.on('ready', main)
