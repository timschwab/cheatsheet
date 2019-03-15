const bluebird = require('bluebird')

// Takes an object with these params:
//   problemTokens
//   solutionTokens
//   keywords
function index(client, id, tokens) {
	// Set the indices
	let problemPromises = tokens.problemTokens.map(token => {
		return client.saddAsync(token + '-problems', id)
	})
	let solutionPromises = tokens.solutionTokens.map(token => {
		return client.saddAsync(token + '-solutions', id)
	})
	let keywordPromises = tokens.keywords.map(keyword => {
		return client.saddAsync(keyword + '-keywords', id)
	})

	let promise = bluebird.all([
		problemPromises,
		solutionPromises,
		keywordPromises
	])

	return promise
}

function unindex(client, id) {
	// do stuff
}

module.exports = {
	index: index,
	unindex: unindex
}
