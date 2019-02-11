const bluebird = require('bluebird')
const tokenize = require('./tokenize')

// Receive query, process it, and send back the results
function snippetSearch(event, client, query) {
	let snippets

	query = query.toLowerCase()
	console.log('search: ' + query)

	// Tokenize the query
	let terms = tokenize(query)

	// Load the pre-calculated term scores into ~~results
	let sets = terms.map(term => {
		return term + '-scores'
	})

	client
		.zunionstoreAsync(['~~results', sets.length].concat(sets))

		// Then get them in order, with the score
		.then(result => {
			return client.zrevrangebyscoreAsync(
				'~~results',
				'+inf',
				'1',
				'WITHSCORES',
				'LIMIT',
				'0',
				'25'
			)
		})

		.then(results => {
			// Separate out keys and scores
			snippets = results.reduce((soFar, nextValue, index) => {
				if (index % 2) {
					soFar[soFar.length - 1].score = nextValue
				} else {
					soFar.push({key: nextValue})
				}

				return soFar
			}, [])

			// Get all the snippets
			let getPromises = snippets.map(snippet => {
				return client.getAsync(snippet.key)
			})

			return bluebird.all(getPromises)
		})

		// Parse and return
		.then(responses => {
			parsed = responses.map((str, index) => {
				let obj = JSON.parse(str)
				obj.score = snippets[index].score
				obj.key = snippets[index].key
				return obj
			})

			event.sender.send('search-result', parsed)
		})
}

module.exports = {search: snippetSearch}
