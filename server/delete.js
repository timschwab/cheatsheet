const bluebird = require('bluebird')
const tokenize = require('./tokenize')
const scoreTerm = require('./score')
const recentlyDeletedOperations = require('./recently-deleted')

function snippetPermanentDelete(event, client, id) {
	console.log('permanent delete: ' + id)

	redisPermanentDelete(client, id).then(result => {
		event.sender.send('permanent-delete-result', {
			status: 'success',
			id: id
		})
	})
}

function snippetUndoableDelete(event, client, id) {
	console.log('undoable delete: ' + id)

	redisUndoableDelete(client, id).then(result => {
		event.sender.send('delete-result', {
			status: 'success',
			id: id
		})
	})
}

function redisPermanentDelete(client, id) {
	// Has it already been deleted?
	let promise = client.zscoreAsync('~~recently-deleted', id).then(score => {
		// It is not in the set - a live snippet
		if (score == null) {
			// Remove indices then delete
			return removeIndices(client, id).then(responses => {
				return client.delAsync(id)
			})

			// It is in the set - recently deleted
		} else {
			// Remove from ~~recently-deleted then delete
			return client.zremAsync('~~recently-deleted', id).then(result => {
				return client.delAsync(id)
			})
		}
	})

	return promise
}

function redisUndoableDelete(client, id) {
	let stamp = new Date().getTime() // Number of milliseconds since UTC epoch

	// Remove any expired deletions from the sorted set
	let promise = recentlyDeletedOperations
		.cleanSet(client)

		// Remove the indices (but do not remove the actual data)
		.then(result => {
			return removeIndices(client, id)
		})

		// Add the id to a sorted set, with the score being the UTC timestamp
		.then(result => {
			return client.zadd('~~recently-deleted', stamp, id)
		})

	return promise
}

function removeIndices(client, id) {
	let problemTokens
	let solutionTokens
	let keywords

	let promise = client

		// Get the snippet data
		.getAsync(id)

		// Recalculate what indicies to remove, then remove them
		.then(snippetText => {
			let snippet = JSON.parse(snippetText)

			// Prep data
			let problem = snippet.problem
			let solution = snippet.solution
			keywords = snippet.keywords.map(keyword => {
				return keyword.toLowerCase()
			})

			problemTokens = tokenize(problem)
			solutionTokens = tokenize(solution)

			// Remove the snippet from the token sets
			let problemPromises = problemTokens.map(token => {
				return client.sremAsync(token + '-problems', id)
			})
			let solutionPromises = solutionTokens.map(token => {
				return client.sremAsync(token + '-solutions', id)
			})
			let keywordPromises = keywords.map(keyword => {
				return client.sremAsync(keyword + '-keywords', id)
			})

			return bluebird.all([problemPromises, solutionPromises, keywordPromises])
		})

		// Calculate the new scores of the terms
		.then(results => {
			let terms = problemTokens.concat(solutionTokens).concat(keywords)
			return terms.map(term => {
				return scoreTerm(client, term)
			})
		})

	return promise
}

module.exports = {
	delete: snippetUndoableDelete,
	permanentDelete: snippetPermanentDelete,
	redisDelete: redisUndoableDelete,
	redisPermanentDelete: redisPermanentDelete
}
