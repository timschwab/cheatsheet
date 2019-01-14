const bluebird = require('bluebird')
const tokenize = require('./tokenize')

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
	// Get snippet
	let promise = client.getAsync(id)
	.then(snippetText => {
		let snippet = JSON.parse(snippetText)

		// Process data
		let problem = snippet.problem
		let solution = snippet.solution
		let keywords = snippet.keywords.map( keyword => { return keyword.toLowerCase() })

		let problemTokens = tokenize(problem)
		let solutionTokens = tokenize(solution)
		
		let problemPromises = problemTokens.map(token => {
			return client.sremAsync(token + '-problems', id)
		})
		let solutionPromises = solutionTokens.map(token => {
			return client.sremAsync(token + '-solutions', id)
		})
		let keywordPromises = keywords.map(keyword => {
			return client.sremAsync(keyword + '-keywords', id)
		})
		let setPromise = client.delAsync(id, JSON.stringify(snippet))

		return bluebird.all([problemPromises, solutionPromises, keywordPromises, setPromise])
	})

	return promise
}

module.exports = {delete: snippetDelete, redisDelete: redisDelete}