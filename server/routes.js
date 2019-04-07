const {ipcMain} = require('electron')

const searchHandler = require('./search')
const getHandler = require('./get')
const addHandler = require('./add')
const editHandler = require('./edit')
const deleteHandler = require('./delete')
const recentlyDeletedHandler = require('./recently-deleted')

function init() {
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

	ipcMain.on('delete:permanent', (event, id) => {
		timeLog(event, id, deleteHandler.permanentDelete)
	})

	ipcMain.on('get:deleted', (event, data) => {
		timeLog(event, data, recentlyDeletedHandler.get)
	})

	ipcMain.on('restore', (event, id) => {
		timeLog(event, id, recentlyDeletedHandler.restore)
	})

	console.log('Routes initialized.\n')
}

// Wrap the handlers in a timer
function timeLog(event, requestData, fn) {
	console.time('time')

	fn(event, requestData)

	console.timeEnd('time')
	console.log()
}

module.exports = {
	init: init
}
