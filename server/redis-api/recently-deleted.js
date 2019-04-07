const bluebird = require('bluebird')

const getHandler = require('./get')
const addHandler = require('./add')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

// Add a snippet to the recently deleted list
function addSnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Add the new deleted
		.then(result => {
			return client.zadd('~~recently-deleted', timeStamp(), id)
		})

	return promise
}

// Get all the snippets in the recently deleted list
function getAll(client, data) {
	let promise

	// Data will contain RPP and page # one day

	// Clean the set
	promise = cleanSet(client)
		// Get the list of IDs
		.then(result => {
			return client.zrevrangebyscoreAsync(
				'~~recently-deleted',
				'+inf',
				expireCutOff()
			)
		})

		// Get the corresponding snippets
		.then(IDs => {
			let getPromises = IDs.map(id => {
				return getHandler.get(client, id)
			})

			return bluebird.all(getPromises)
		})

	return promise
}

// Restore a snippet from the recently deleted list
function restoreSnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Remove from set
		.then(result => {
			return client.zremAsync('~~recently-deleted', id)
		})

		// Do an indexAndScore to make it searchable
		.then(result => {
			return addHandler.indexAndScore(client, id)
		})

	return promise
}

// Permanently delete a snippet
function deleteSnippet(client, id) {
	// stuff
}

/* Utility functions below this line */

function cleanSet(client) {
	// Remove any expired deletions from the sorted set
	let promise

	promise = client.zremrangebyscoreAsync(
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

/* Export */

module.exports = {
	add: addSnippet,
	getAll: getAll,
	restore: restoreSnippet
}
