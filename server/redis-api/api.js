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
let api = {init: init}

function init() {
	// Get the redis client
	client = redis.createClient()

	// Set up the API
	api.add = data => {
		return addHandler.fullAdd(client, data)
	}

	api.search = query => {
		return searchHandler.search(client, query)
	}

	api.get = id => {
		return getHandler.get(client, id)
	}

	api.edit = (id, newData) => {
		return editHandler.edit(client, id, newData)
	}

	api.undoableDelete = id => {
		return deleteHandler.undoableDelete(client, id)
	}

	api.getRecentlyDeleted = data => {
		return recentlyDeletedHandler.getAll(client, data)
	}

	api.restoreRecentlyDeleted = id => {
		return recentlyDeletedHandler.restore(client, id)
	}

	api.deleteRecentlyDeleted = id => {
		return recentlyDeletedHandler.delete(client, id)
	}

	console.log('Redis API initialized.')
}

module.exports = api
