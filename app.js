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
ipcMain.on('search', (event, query) => { router(event, query, 'search') })
ipcMain.on('get', (event, id) => { router(event, id, 'get') })
ipcMain.on('add', (event, data) => { router(event, data, 'add') })
ipcMain.on('delete', (event, id) => { router(event, id, 'delete') })

// Essentially here to time the functions
function router(event, req, type) {
	console.time('time')

	switch (type) {
		case 'search':
			searchHandler(event, client, req)
			break
		case 'get':
			getHandler(event, client, req)
			break
		case 'add':
			addHandler(event, client, req)
			break
		case 'delete':
			deleteHandler(event, client, req)
			break
		default:
			console.log('Unrecognized request: ' + type)
	}

	console.timeEnd('time')
	console.log()
}

// Start app
app.on('ready', main)

