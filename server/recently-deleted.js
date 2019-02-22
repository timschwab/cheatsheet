const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

function get(client, rpp, page) {
	return 'not implemented'
}

function cleanSet(client) {
	let stamp = new Date().getTime() // Number of milliseconds since UTC epoch
	let expireCutOff = stamp - cutOffDays * millisecondsInDay

	// Remove any expired deletions from the sorted set
	return client.zremrangebyscoreAsync(
		'~~recently-deleted',
		'-inf',
		expireCutOff
	)
}

module.exports = {
	cleanSet: cleanSet
}
