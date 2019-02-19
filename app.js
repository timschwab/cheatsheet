// Library includes
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

// Electron infrastructure
const menu = require('./server/menu')
// routes

// Redis interactions
const searchHandler = require('./server/search')
const getHandler = require('./server/get')
const addHandler = require('./server/add')
const editHandler = require('./server/edit')
const deleteHandler = require('./server/delete')

let client

// Connect to redis and set up the main window
function main() {
	// Connect to redis
	client = redis.createClient()

	// Create main window
	let win = new BrowserWindow({width: 800, height: 600})
	Menu.setApplicationMenu(menu)
	win.loadFile('client/index.html')
}

// Routes
ipcMain.on('search', (event, query) => {
	timeLog(event, query, searchHandler.search)
})
ipcMain.on('get', (event, id) => {
	timeLog(event, id, getHandler.get)
})
ipcMain.on('add', (event, data) => {
	timeLog(event, data, addHandler.add)
})
ipcMain.on('edit:get', (event, data) => {
	timeLog(event, data, editHandler.get)
})
ipcMain.on('edit:change', (event, data) => {
	timeLog(event, data, editHandler.change)
})
ipcMain.on('delete', (event, id) => {
	timeLog(event, id, deleteHandler.delete)
})

// Wrap the handlers in a timer
function timeLog(event, request, fn) {
	console.time('time')

	fn(event, client, request)

	console.timeEnd('time')
	console.log()
}

// Start app
app.on('ready', main)
