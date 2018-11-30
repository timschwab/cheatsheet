const bluebird = require('bluebird')

// Receive query, process it, and send back the results
function search(event, client, query) {
	query = query.toLowerCase()
	console.log("search: " + query)

	// Get scores of each term and store them in redis
	let terms = query.split(' ')
	let scorePromises = terms.map((term, index) => {
		return client.zunionstoreAsync('~~scores-' + index, '3', term + '-keywords', term + '-problems', term + '-solutions', 'WEIGHTS', '10', '3', '1')
	})

	// Set up some vars
	let sets = terms.map((term, index) => {
		return '~~scores-' + index
	})

	let snippets

	// When all scores have been calculated
	bluebird.all(scorePromises)

	// Load them all into ~~results
	.then(responses => {
		return client.zunionstoreAsync(['~~results', sets.length].concat(sets))
	})

	// Then get them in order, with the score
	.then(result => {
		return client.zrevrangebyscoreAsync('~~results', '+inf', '1', 'WITHSCORES', 'LIMIT', '0', '25')
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

module.exports = search


