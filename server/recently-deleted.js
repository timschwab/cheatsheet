const api = require('./redis-api/api')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

function snippetsGet(event, data) {
	console.log('get:deleted:')
	console.log(data)

	// Get the recently deleted snippets
	api.getRecentlyDeleted(client).then(snippets => {
		event.sender.send('get:deleted-result', snippets)
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
