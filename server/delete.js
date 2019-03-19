const api = require('./redis-api/api')

function snippetUndoableDelete(event, id) {
	console.log('undoable delete: ' + id)

	api.undoableDelete(id).then(result => {
		event.sender.send('delete-result', {
			status: 'success',
			id: id
		})
	})
}

function snippetPermanentDelete(event, client, id) {
	console.log('permanent delete: ' + id)

	// TODO: uncomment this and implement the frontend response
	//redisPermanentDelete(client, id).then(result => {
	//	event.sender.send('permanent:delete-result', {
	//		status: 'success',
	//		id: id
	//	})
	//})
}

function redisPermanentDelete(client, id) {
	// Has it already been deleted?
	let promise = client.zscoreAsync('~~recently-deleted', id).then(score => {
		if (score === null) {
			// It is not in the set - a live snippet
			// Remove indices then delete
			return removeIndices(client, id).then(responses => {
				return client.delAsync(id)
			})
		} else {
			// It is in the set - recently deleted
			// Remove from ~~recently-deleted then delete
			return client.zremAsync('~~recently-deleted', id).then(result => {
				return client.delAsync(id)
			})
		}
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
	permanentDelete: snippetPermanentDelete
}
