const getHandler = require('./get')
const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')

// Note: This function overwrites the id if data is there already
function simpleAdd(client, id, data) {
	let promise

	// Store the snippet data
	promise = client.setAsync(id, JSON.stringify(data))

	return promise
}

// Get data -> tokenize -> index -> score
function indexAndScore(client, id) {
	let promise
	let tokens

	// Get the snippet data
	promise = getHandler
		.get(client, id)

		// Tokenize it
		.then(data => {
			return tokenizeHandler.tokenizeData(data)
		})

		// Index the tokens
		.then(snippetTokens => {
			tokens = snippetTokens
			return indexHandler.index(client, id, tokens)
		})

		// Score the tokens
		.then(result => {
			return scoreHandler.score(client, tokens)
		})

	return promise
}

// Get next ID -> simple add -> tokenize and score
function fullAdd(client, data) {
	let promise
	let tokens
	let id

	// Get next ID
	promise = client
		.incrAsync('~~counter')

		// Add
		.then(counter => {
			id = counter
			return simpleAdd(client, id, data)
		})

		// Tokenize it
		.then(result => {
			return indexAndScore(client, id)
		})

	// Return
	return promise
}

module.exports = {
	simpleAdd: simpleAdd,
	indexAndScore: indexAndScore,
	fullAdd: fullAdd
}
