const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

const searchHandler = require('./server/search.js')
const getHandler = require('./server/get.js')
const addHandler = require('./server/add.js')
const deleteHandler = require('./server/delete.js')

let win
let client

// Connect to redis and set up the main window
function main() {
	// Connect to redis
	client = redis.createClient()

	// Create main window
	win = new BrowserWindow({width: 800, height: 600})
	const menu = Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{ label: 'Install sheet' },
				{ label: 'Remove sheet' }
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Refresh',
					role: 'reload'
				},
				{
					label: 'Dev tools',
					role: 'toggledevtools'
				}
			]
		}
	])
	Menu.setApplicationMenu(menu)
	win.loadFile('client/search.html')
}

// Routes
ipcMain.on('search', (event, query) => { timeLog(event, query, searchHandler) })
ipcMain.on('get', (event, id) => { timeLog(event, id, getHandler) })
ipcMain.on('add', (event, data) => { timeLog(event, data, addHandler) })
ipcMain.on('delete', (event, id) => { timeLog(event, id, deleteHandler) })

// Wrap the handlers in a timer
function timeLog(event, request, fn) {
	console.time('time')

	fn(event, client, request)

	console.timeEnd('time')
	console.log()
}

// Start app
app.on('ready', main)

