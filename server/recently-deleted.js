const bluebird = require('bluebird')
const getHandler = require('./get')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

function snippetsGet(event, client, data) {
	console.log('get:deleted:')
	console.log(data)

	// Clean up the set every time we can
	cleanSet(client)
		// Get the recently deleted snippets
		.then(result => {
			return redisGet(client, data)
		})

		// Get the data for all snippets
		.then(IDs => {
			let getPromises = IDs.map(id => {
				return getHandler.redisGet(client, id)
			})

			return bluebird.all(getPromises)
		})

		// Parse the data and return
		.then(snippets => {
			let parsed = snippets.map(JSON.parse)
			event.sender.send('get:deleted-result', parsed)
		})
}

function redisGet(client, data) {
	// TODO: utilize RPP and page #

	let promise = client.zrevrangebyscoreAsync(
		'~~recently-deleted',
		'+inf',
		expireCutOff()
	)

	return promise
}

function cleanSet(client) {
	// Remove any expired deletions from the sorted set
	let promise = client.zremrangebyscoreAsync(
		'~~recently-deleted',
		'-inf',
		expireCutOff()
	)

	return promise
}

function timeStamp() {
	// Number of milliseconds since UTC epoch
	return new Date().getTime()
}

function expireCutOff(stamp) {
	stamp = stamp || timeStamp()

	return stamp - cutOffDays * millisecondsInDay
}

module.exports = {
	get: snippetsGet,
	redisGet: redisGet,
	cleanSet: cleanSet
}
