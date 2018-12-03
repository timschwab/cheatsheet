const bluebird = require('bluebird')
const tokenize = require('./tokenize')

// Receive data, process, add to Redis, and send back success message to client
function add(event, client, data) {
	console.log('add:')
	console.log(data)

	// Process data
	let problem = data.problem
	let solution = data.solution
	let keywords = map(data.keywords, keyword => { return keyword.toLowerCase() })

	let problemTokens = tokenize(problem)
	let solutionTokens = tokenize(solution)

	// Get next snippet index
	client.incrAsync('~~counter')

	// Set data
	.then(counter => {
		problemPromises = problemTokens.map(token => {
			return client.saddAsync(token + '-problems', counter)
		})
		solutionPromises = solutionTokens.map(token => {
			return client.saddAsync(token + '-solutions', counter)
		})
		keywordPromises = keywords.map(keyword => {
			return client.saddAsync(keyword + '-keywords', counter)
		})
		setPromise = client.setAsync(counter, JSON.stringify(data))

		return bluebird.all([problemPromises, solutionPromises, keywordPromises, setPromise])
	})

	// Send back message to client
	.then(results => {
		event.sender.send('add-result', {
			status: 'success'
		})
	})
}

module.exports = add