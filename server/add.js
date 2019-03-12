const bluebird = require('bluebird')
const tokenize = require('./tokenize')
const indexer = require('./score')

// Receive data, process, add to Redis, and send back success message to client
function snippetAdd(event, client, data) {
	console.log('add:')
	console.log(data)

	// Get next snippet index
	client
		.incrAsync('~~counter')

		// Set data
		.then(counter => {
			redisAdd(client, counter, data)
		})

		// Send back message to client
		.then(results => {
			event.sender.send('add-result', {
				status: 'success'
			})
		})
}

// Assumes id is unused
function redisAdd(client, id, data) {
	let promise

	// Prep data
	let problem = data.problem
	let solution = data.solution
	let keywords = data.keywords.map(keyword => {
		return keyword.toLowerCase()
	})

	let problemTokens = tokenize(problem)
	let solutionTokens = tokenize(solution)

	// Store the snippet data
	promise = client
		.setAsync(id, JSON.stringify(data))

		// Calculate the reverse indicies
		.then(result => {
			indexer.indexSnippet(client, id, data)
		})

	return promise
}

module.exports = {
	add: snippetAdd,
	redisAdd: redisAdd
}
