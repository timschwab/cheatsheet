const bluebird = require('bluebird')

const getHandler = require('./get')
const addHandler = require('./add')
const deleteHandler = require('./delete')

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
			return removeFromRecentlyDeleted(client, id)
		})

		// Do an indexAndScore to make it searchable
		.then(result => {
			return addHandler.indexAndScore(client, id)
		})

	return promise
}

// Permanently delete a snippet
function deleteSnippet(client, id) {
	let promise

	// Clean the set
	promise = cleanSet(client)
		// Remove from the set of recently deleted
		.then(result => {
			return removeFromRecentlyDeleted(client, id)
		})

		// Delete snippet data
		.then(result => {
			return deleteHandler.simpleDelete(client, id)
		})

	return promise
}
console.log(getHandler.get)
/***** Utility functions below this line *****/

// Remove any expired deletions from the sorted set
function cleanSet(client) {
	let promise

	// Note that this leaves the underlying Redis string that holds the snippet data
	promise = client.zremrangebyscoreAsync(
		'~~recently-deleted',
		'-inf',
		expireCutOff()
	)

	return promise
}

// Note - this does not clean the set, because it is a helper function
function removeFromRecentlyDeleted(client, id) {
	let promise

	// Clean the set
	promise = client.zremAsync('~~recently-deleted', id)

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

module.exports = {
	add: addSnippet,
	getAll: getAll,
	restore: restoreSnippet,
	delete: deleteSnippet
}
