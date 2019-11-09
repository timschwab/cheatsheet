// Takes an object with these params:
//   problemTokens
//   solutionTokens
//   keywords
function index(client, id, tokens) {
	let problemPromises = tokens.problemTokens.map(token => {
		return client.saddAsync(token + '-problems', id)
	})
	let solutionPromises = tokens.solutionTokens.map(token => {
		return client.saddAsync(token + '-solutions', id)
	})
	let keywordPromises = tokens.keywords.map(keyword => {
		return client.saddAsync(keyword + '-keywords', id)
	})

	let promise = Promise.all([
		problemPromises,
		solutionPromises,
		keywordPromises
	])

	return promise
}

// Takes an object with these params:
//   problemTokens
//   solutionTokens
//   keywords
function unindex(client, id, tokens) {
	let problemPromises = tokens.problemTokens.map(token => {
		return client.sremAsync(token + '-problems', id)
	})
	let solutionPromises = tokens.solutionTokens.map(token => {
		return client.sremAsync(token + '-solutions', id)
	})
	let keywordPromises = tokens.keywords.map(keyword => {
		return client.sremAsync(keyword + '-keywords', id)
	})

	let promise = Promise.all([
		problemPromises,
		solutionPromises,
		keywordPromises
	])

	return promise
}

module.exports.index = index
module.exports.unindex = unindex
