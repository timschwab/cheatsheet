const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')
const droppedHandler = require('./dropped')

function simpleDelete(client, id) {
	let promise

	// Delete the actual snippet data
	promise = client.delAsync(id)

	return promise
}

function unindexAndScore(client, id) {
	let promise
	let tokens

	// Get the tokenized snippet data
	promise = tokenizeHandler
		.tokenizeID(client, id)

		// Unindex the tokens
		.then(snippetTokens => {
			tokens = snippetTokens
			return indexHandler.unindex(client, id, tokens)
		})

		// Re-score the tokens
		.then(result => {
			return scoreHandler.score(client, tokens)
		})

	return promise
}

function drop(client, id) {
	let promise

	// Remove from search results
	promise = unindexAndScore(client, id)
		// Add to the dropped
		.then(results => {
			return droppedHandler.add(client, id)
		})

	return promise
}

function fullDelete(client, id) {
	let promise

	// Remove from search results
	promise = unindexAndScore(client, id)
		// Delete the actual snippet data
		.then(results => {
			return simpleDelete(client, id)
		})

	return promise
}

module.exports.simpleDelete = simpleDelete
module.exports.unindexAndScore = unindexAndScore
module.exports.drop = drop
module.exports.fullDelete = fullDelete
