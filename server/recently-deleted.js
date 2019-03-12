const bluebird = require('bluebird')
const getHandler = require('./get')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

function snippetsGet(event, client, data) {
	console.log('get:deleted:')
	console.log(data)

	let snippetIDs

	// Clean up the set every time we can
	cleanSet(client)
		// Get the recently deleted snippets
		.then(result => {
			return redisGet(client, data)
		})

		// Get the data for all snippets
		.then(IDs => {
			snippetIDs = IDs

			let getPromises = IDs.map(id => {
				return getHandler.redisGet(client, id)
			})

			return bluebird.all(getPromises)
		})

		// Parse the data and return
		.then(snippets => {
			let parsed = snippets.map((str, index) => {
				let obj = JSON.parse(str)
				obj.id = snippetIDs[index]
				return obj
			})

			event.sender.send('get:deleted-result', parsed)
		})
}

function snippetRestore(event, client, id) {
	console.log('restore: ' + id)

	// Clean up the set every time we can
	cleanSet(client)
		// Restore the snippet
		.then(result => {
			return redisRestore(client, id)
		})

		// Return success
		.then(result => {
			event.sender.send('restore-result', {
				status: 'success'
			})
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

function redisRestore(client, id) {
	// Remove from the recently deleted
	let promise = client
		.zremAsync('~~recently-deleted', id)

		// Re-index
		.then(result => {})

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
	restore: snippetRestore,
	redisGet: redisGet,
	redisRestore: redisRestore,
	cleanSet: cleanSet
}
