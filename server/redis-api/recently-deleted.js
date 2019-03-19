const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

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

module.exports = {
	add: addSnippet
}
