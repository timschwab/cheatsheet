const {ipcMain} = require('electron');

const searchHandler = require('./search');
const getHandler = require('./get');
const addHandler = require('./add');
const editHandler = require('./edit');
const dropHandler = require('./drop');
const droppedHandler = require('./dropped');

function init() {
	ipcMain.on('add', (event, data) => {
		timeLog(event, data, addHandler.add);
	});

	ipcMain.on('search', (event, query) => {
		timeLog(event, query, searchHandler.search);
	});

	ipcMain.on('get', (event, id) => {
		timeLog(event, id, getHandler.get);
	});

	ipcMain.on('edit:get', (event, data) => {
		timeLog(event, data, editHandler.get);
	});

	ipcMain.on('edit:change', (event, data) => {
		timeLog(event, data, editHandler.change);
	});

	ipcMain.on('drop', (event, id) => {
		timeLog(event, id, dropHandler.drop);
	});

	ipcMain.on('get:dropped', (event, data) => {
		timeLog(event, data, droppedHandler.get);
	});

	ipcMain.on('restore', (event, id) => {
		timeLog(event, id, droppedHandler.restore);
	});

	ipcMain.on('destroy', (event, id) => {
		timeLog(event, id, droppedHandler.destroy);
	});

	console.log('Routes initialized.\n');
}

// Wrap the handlers in a timer
function timeLog(event, requestData, fn) {
	console.time('time');

	fn(event, requestData);

	console.timeEnd('time');
	console.log();
}

module.exports = {
	init: init
};
