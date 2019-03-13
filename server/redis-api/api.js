const redis = require('redis')

const addHandler = require('./add')
const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')
const getHandler = require('./get')
const searchHandler = require('./search')
const deleteHandler = require('./delete')
const editHandler = require('./edit')

let client
let api = {init: init}

function init(redisClient) {
	// Get the redis client
	client = redis.createClient()

	api.add = data => {
		return addHandler.fullAdd(client, data)
	}

	api.get = id => {
		return getHandler.get(client, id)
	}

	console.log('Redis API initialized.')
}

module.exports = api
