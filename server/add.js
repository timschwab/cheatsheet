const bluebird = require('bluebird')
const tokenize = require('./tokenize')

// Receive data, process, add to Redis, and send back success message to client
function snippetAdd(event, client, data) {
	console.log('add:')
	console.log(data)

	// Get next snippet index
	client.incrAsync('~~counter')

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
	// Process data
	let problem = data.problem
	let solution = data.solution
	let keywords = data.keywords.map(keyword => { return keyword.toLowerCase() })

	let problemTokens = tokenize(problem)
	let solutionTokens = tokenize(solution)

	let problemPromises = problemTokens.map(token => {
		return client.saddAsync(token + '-problems', id)
	})
	let solutionPromises = solutionTokens.map(token => {
		return client.saddAsync(token + '-solutions', id)
	})
	let keywordPromises = keywords.map(keyword => {
		return client.saddAsync(keyword + '-keywords', id)
	})
	let setPromise = client.setAsync(id, JSON.stringify(data))

	return bluebird.all([problemPromises, solutionPromises, keywordPromises, setPromise])
}

module.exports = {add: snippetAdd, redisAdd: redisAdd}