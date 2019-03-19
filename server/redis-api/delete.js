const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')
const recentlyDeletedHandler = require('./recently-deleted')

function simpleDelete(client, id) {
	let promise

	// Delete the actual snippet data
	promise = client.delAsync(id)

	return promise
}

function undoableDelete(client, id) {
	let promise
	let tokens

	// Tokenize
	promise = tokenizeHandler
		.tokenizeID(client, id)

		// Remove indices
		.then(snippetTokens => {
			tokens = snippetTokens
			return indexHandler.unindex(client, id, tokens)
		})

		// Re-score the affected tokens
		.then(results => {
			return scoreHandler.score(client, tokens)
		})

		// Add to the recently deleted
		.then(results => {
			return recentlyDeletedHandler.add(client, id)
		})

	return promise
}

module.exports = {
	simpleDelete: simpleDelete,
	undoableDelete: undoableDelete
}
