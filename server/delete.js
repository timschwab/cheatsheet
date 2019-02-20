const bluebird = require('bluebird')
const tokenize = require('./tokenize')
const scoreTerm = require('./score')

function snippetPermanentDelete(event, client, id) {
	console.log('permanent delete: ' + id)

	redisPermanentDelete(client, id).then(result => {
		event.sender.send('delete-result', {
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
	// Remove the indices
	let promise = removeIndices(client, id)
		// Delete the snippet
		.then(responses => {
			return client.delAsync(id)
		})

	return promise
}

function redisUndoableDelete(client, id) {
	// Remove any expired deletions from the sorted set
	// Remove the indices
	// Add the key to a sorted set, with the score being the UTC timestamp
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
	delete: snippetPermanentDelete,
	redisDelete: redisPermanentDelete,
	redisPermanentDelete: redisPermanentDelete
}
