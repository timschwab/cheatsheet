const tokenizeHandler = require('./tokenize')
const indexHandler = require('./index')
const scoreHandler = require('./score')

// Overwrites id if data is there laready
function simpleAdd(client, id, data) {
	let promise

	// Store the snippet data
	promise = client.setAsync(id, JSON.stringify(data))

	return promise
}

// Get next ID -> simple add -> tokenize -> index -> score
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

		// Tokenize
		.then(result => {
			return tokenizeHandler.tokenizeData(data)
		})

		// Index
		.then(snippetTokens => {
			tokens = snippetTokens
			return indexHandler.index(client, id, tokens)
		})

		// Score
		.then(result => {
			return scoreHandler.score(client, tokens)
		})

	// Return
	return promise
}

module.exports = {
	simpleAdd: simpleAdd,
	fullAdd: fullAdd
}
