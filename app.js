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
ipcMain.on('search', (event, query) => {searchHandler(event, client, query)})
ipcMain.on('get', (event, id) => {getHandler(event, client, id)})
ipcMain.on('add', (event, data) => {addHandler(event, client, data)})
ipcMain.on('delete', (event, data) => {deleteHandler(event, client, data)})

// Start app
app.on('ready', main)

