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

	api.get = id => {
		return getHandler.get(client, id)
	}

	api.search = query => {
		return searchHandler.search(client, query)
	}

	api.undoableDelete = id => {
		return deleteHandler.undoableDelete(client, id)
	}

	api.getRecentlyDeleted = () => {
		return recentlyDeletedHandler.getAll(client)
	}

	console.log('Redis API initialized.')
}

module.exports = api
