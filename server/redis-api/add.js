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

// Get next ID, then add, then tokenize, then index, then score
function fullAdd(client, data) {
	let promise
	let tokens

	// Get next ID
	promise = client
		.incrAsync('~~counter')

		// Add
		.then(counter => {
			simpleAdd(client, counter, data)
		})

		// Tokenize
		.then(result => {
			tokenizeHandler.tokenizeData(client, id, data)
		})

		// Index
		.then(snippetTokens => {
			tokens = snippetTokens
			indexHandler.indexWithTokens(client, id, tokens)
		})

		// Score
		.then(result => {
			scoreHandler.score(client, id, tokens)
		})

	// Return
	return promise
}

module.exports = {
	simpleAdd: simpleAdd,
	fullAdd: fullAdd
}
