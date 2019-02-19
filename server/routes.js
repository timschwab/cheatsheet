const {ipcMain} = require('electron')

const searchHandler = require('./search')
const getHandler = require('./get')
const addHandler = require('./add')
const editHandler = require('./edit')
const deleteHandler = require('./delete')

let client

function init(redisClient) {
	client = redisClient

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

	console.log('Routes initialized.')
}

// Wrap the handlers in a timer
function timeLog(event, requestData, fn) {
	console.time('time')

	fn(event, client, requestData)

	console.timeEnd('time')
	console.log()
}

module.exports = {init: init}
