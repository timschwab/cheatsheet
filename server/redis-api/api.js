/*
	Available functions:
		init()
		add(data)
		search(query)
		get(id)
		edit(id, newData)
		undoableDelete(id)
		getRecentlyDeleted(data)
		restoreRecentlyDeleted(id)
		deleteRecentlyDeleted(id)
*/

const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

const addHandler = require('./add')
const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')

const getHandler = require('./get')
const searchHandler = require('./search')
const editHandler = require('./edit')
const deleteHandler = require('./delete')

const recentlyDeletedHandler = require('./recently-deleted')

let client

function init() {
	// Get the redis client
	client = redis.createClient()

	// Set up the API
	module.exports.add = data => {
		return addHandler.fullAdd(client, data)
	}

	module.exports.search = query => {
		return searchHandler.search(client, query)
	}

	module.exports.get = id => {
		return getHandler.get(client, id)
	}

	module.exports.edit = (id, newData) => {
		return editHandler.edit(client, id, newData)
	}

	module.exports.undoableDelete = id => {
		return deleteHandler.undoableDelete(client, id)
	}

	module.exports.getRecentlyDeleted = data => {
		return recentlyDeletedHandler.getAll(client, data)
	}

	module.exports.restoreRecentlyDeleted = id => {
		return recentlyDeletedHandler.restore(client, id)
	}

	module.exports.deleteRecentlyDeleted = id => {
		return recentlyDeletedHandler.delete(client, id)
	}

	console.log('Redis API initialized.')
}

module.exports.init = init
