const bluebird = require('bluebird')
const tokenize = require('./tokenize')
const scoreTerm = require('./score')

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
			let problemPromises = problemTokens.map(token => {
				return client.saddAsync(token + '-problems', id)
			})
			let solutionPromises = solutionTokens.map(token => {
				return client.saddAsync(token + '-solutions', id)
			})
			let keywordPromises = keywords.map(keyword => {
				return client.saddAsync(keyword + '-keywords', id)
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
	add: snippetAdd,
	redisAdd: redisAdd
}
