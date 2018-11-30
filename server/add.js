const bluebird = require('bluebird')

// Receive data, process, add to Redis, and send back success message to client
function add(event, client, data) {
	console.log('add:')
	console.log(data)

	// Process data
	let problem = data.problem
	let solution = data.solution
	let keywords = data.keywords

	let problemTokens = extractTokens(problem)
	let solutionTokens = extractTokens(solution)

	// Get next snippet index
	client.incrAsync('~~counter')

	// Set data
	.then(counter => {
		problemPromises = problemTokens.map(token => {
			return client.sadd(token + '-problems', counter)
		})
		solutionPromises = solutionTokens.map(token => {
			return client.sadd(token + '-solutions', counter)
		})
		keywordPromises = keywords.map(keyword => {
			return client.sadd(keyword + '-keywords', counter)
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

function extractTokens(str) {
	// Lowercase everything
	str = str.toLowerCase()

	// Turn unneded characters into whitespace
	str = str.replace(/[^\s\da-z]|(\s)/g, ' ')

	// Get rid of unneeded words
	str = str.replace(/\b(the)\b|\b(and)\b|\b(is)\b|\b(to)\b|\b(by)\b|\b(is)\b|\b(in)\b|\b(with)\b/g, '')

	// Get rid of unneeded whitespace
	str = str.replace(/\s+/g, ' ')

	// Remove possible front and back spaces
	str = str.trim()

	// Tokenize
	let tokens = str.split(' ')

	return tokens
}

module.exports = add