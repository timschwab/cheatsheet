const bluebird = require('bluebird')
const tokenize = require('./tokenize')

function deleteSnippet(event, client, id) {
	console.log('delete: ' + id)

	// Get snippet
	client.getAsync(id)
	.then(snippetText => {
		let snippet = JSON.parse(snippetText)

		// Process data
		let problem = snippet.problem
		let solution = snippet.solution
		let keywords = map(snippet.keywords, keyword => { return keyword.toLowerCase() })

		let problemTokens = tokenize(problem)
		let solutionTokens = tokenize(solution)
		
		problemPromises = problemTokens.map(token => {
			return client.sremAsync(token + '-problems', id)
		})
		solutionPromises = solutionTokens.map(token => {
			return client.sremAsync(token + '-solutions', id)
		})
		keywordPromises = keywords.map(keyword => {
			return client.sremAsync(keyword + '-keywords', id)
		})
		setPromise = client.delAsync(id, JSON.stringify(snippet))

		return bluebird.all([problemPromises, solutionPromises, keywordPromises, setPromise])
	})
	.then(result => {
		event.sender.send('delete-result', {
			status: 'success'
		})
	})
}

module.exports = deleteSnippet