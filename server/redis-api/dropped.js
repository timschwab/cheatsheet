const getHandler = require('./get')
const addHandler = require('./add')
const dropHandler = require('./drop')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

// Add a snippet to the dropped list
function addSnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Add the new dropped
		.then(result => {
			return client.zadd('~~dropped', timeStamp(), id)
		})

	return promise
}

// Get all the snippets in the dropped list
function getAll(client, data) {
	let promise

	// Data will contain RPP and page # one day

	// Clean the set
	promise = cleanSet(client)
		// Get the list of IDs
		.then(result => {
			return client.zrevrangebyscoreAsync('~~dropped', '+inf', expireCutOff())
		})

		// Get the corresponding snippets
		.then(IDs => {
			let getPromises = IDs.map(id => {
				return getHandler.get(client, id)
			})

			return Promise.all(getPromises)
		})

	return promise
}

// Restore a snippet from the dropped list
function restoreSnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Remove from set
		.then(result => {
			return removeFromDropped(client, id)
		})

		// Do an indexAndScore to make it searchable
		.then(result => {
			return addHandler.indexAndScore(client, id)
		})

	return promise
}

// Destroy a snippet
function destroySnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Remove from the set of dropped
		.then(result => {
			return removeFromDropped(client, id)
		})

		// Delete snippet data
		.then(result => {
			return dropHandler.simpleDelete(client, id)
		})

	return promise
}

/***** Utility functions below this line *****/

// Remove any expired deletions from the sorted set
function cleanSet(client) {
	let promise

	// Note that this leaves the underlying Redis string that holds the snippet data
	promise = client.zremrangebyscoreAsync('~~dropped', '-inf', expireCutOff())

	return promise
}

// Note - this does not clean the set, because it is a helper function
function removeFromDropped(client, id) {
	let promise

	// Remove member from set
	promise = client.zremAsync('~~dropped', id)

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

/***** Export *****/

module.exports.add = addSnippet
module.exports.getAll = getAll
module.exports.restore = restoreSnippet
module.exports.destroy = destroySnippet
