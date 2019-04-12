const bluebird = require('bluebird')

// Takes an object with these params:
//   problemTokens
//   solutionTokens
//   keywords
function score(client, tokens) {
	let problemPromises = tokens.problemTokens.map(token => {
		return scoreToken(client, token)
	})
	let solutionPromises = tokens.solutionTokens.map(token => {
		return scoreToken(client, token)
	})
	let keywordPromises = tokens.keywords.map(keyword => {
		return scoreToken(client, keyword)
	})

	let promise = bluebird.all([
		problemPromises,
		solutionPromises,
		keywordPromises
	])

	return promise
}

function scoreToken(client, token) {
	return client.zunionstoreAsync(
		token + '-scores',
		'3',
		token + '-keywords',
		token + '-problems',
		token + '-solutions',
		'WEIGHTS',
		'10',
		'3',
		'1'
	)
}

module.exports.score = score
