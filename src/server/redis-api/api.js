/*
	Available functions:
		init()
		add(data)
		search(query)
		get(id)
		edit(id, newData)
		drop(id)
		getDropped(data)
		restore(id)
		destroy(id)
*/

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const addHandler = require('./add');
const tokenizeHandler = require('./tokenize');
const indexHandler = require('./index');
const scoreHandler = require('./score');

const getHandler = require('./get');
const searchHandler = require('./search');
const editHandler = require('./edit');
const dropHandler = require('./drop');

const droppedHandler = require('./dropped');

let client;

function init() {
	// Get the redis client
	client = redis.createClient();

	// Set up the API
	module.exports.add = data => {
		return addHandler.fullAdd(client, data);
	};

	module.exports.search = query => {
		return searchHandler.search(client, query);
	};

	module.exports.get = id => {
		return getHandler.get(client, id);
	};

	module.exports.edit = (id, newData) => {
		return editHandler.edit(client, id, newData);
	};

	module.exports.drop = id => {
		return dropHandler.drop(client, id);
	};

	module.exports.getDropped = data => {
		return droppedHandler.getAll(client, data);
	};

	module.exports.restore = id => {
		return droppedHandler.restore(client, id);
	};

	module.exports.destroy = id => {
		return droppedHandler.destroy(client, id);
	};

	console.log('Redis API initialized.');
}

module.exports.init = init;
