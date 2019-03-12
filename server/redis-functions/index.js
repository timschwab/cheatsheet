const tokenize = require('./tokenize')

function indexSnippet(client, id, data) {
	// Prep data
	let problem = data.problem
	let solution = data.solution
	let keywords = data.keywords.map(keyword => {
		return keyword.toLowerCase()
	})

	let problemTokens = tokenize(problem)
	let solutionTokens = tokenize(solution)

	// Set the indices
	let problemPromises = problemTokens.map(token => {
		return client.saddAsync(token + '-problems', id)
	})
	let solutionPromises = solutionTokens.map(token => {
		return client.saddAsync(token + '-solutions', id)
	})
	let keywordPromises = keywords.map(keyword => {
		return client.saddAsync(keyword + '-keywords', id)
	})

	let promise = bluebird
		.all([problemPromises, solutionPromises, keywordPromises])

		// Finally, pre-calculate the new scores of the terms
		.then(results => {
			let terms = problemTokens.concat(solutionTokens).concat(keywords)
			return terms.map(term => {
				return scoreTerm(client, term)
			})
		})

	return promise
}

function unindexSnippet(client, id) {}

module.exports = {
	index: indexSnippet,
	unindex: unindexSnippet
}
