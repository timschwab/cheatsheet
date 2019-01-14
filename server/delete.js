const bluebird = require('bluebird')
const tokenize = require('./tokenize')
const scoreTerm = require('./score')

function snippetDelete(event, client, id) {
	console.log('delete: ' + id)

	redisDelete(client, id)
	.then(result => {
		event.sender.send('delete-result', {
			status: 'success',
			id: id
		})
	})
}

function redisDelete(client, id) {
	let problemTokens
	let solutionTokens
	let keywords

	// Get snippet
	let promise = client.getAsync(id)
	.then(snippetText => {
		let snippet = JSON.parse(snippetText)

		// Prep data
		let problem = snippet.problem
		let solution = snippet.solution
		keywords = snippet.keywords.map( keyword => { return keyword.toLowerCase() })

		problemTokens = tokenize(problem)
		solutionTokens = tokenize(solution)
		
		// Remove the snippet from the token sets
		let problemPromises = problemTokens.map(token => {
			return client.sremAsync(token + '-problems', id)
		})
		let solutionPromises = solutionTokens.map(token => {
			return client.sremAsync(token + '-solutions', id)
		})
		let keywordPromises = keywords.map(keyword => {
			return client.sremAsync(keyword + '-keywords', id)
		})

		return bluebird.all([problemPromises, solutionPromises, keywordPromises])
	})

	// Delete the snippet
	.then(responses => {
		return client.delAsync(id)
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

module.exports = {delete: snippetDelete, redisDelete: redisDelete}