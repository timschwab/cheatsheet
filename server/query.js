const bluebird = require('bluebird')

// Receive query, process it, and send back the results
function query(event, client, q) {
	q = q.toLowerCase()
	console.log("\nReceived query: " + q)

	// Get scores of each term and store them in redis
	let terms = q.split(' ')
	let scorePromises = terms.map((term, index) => {
		return client.zunionstoreAsync('~~scores-' + index, '3', term + '-keywords', term + '-problems', term + '-solutions', 'WEIGHTS', '10', '3', '1')
	})

	// Set up some vars
	let sets = terms.map((term, index) => {
		return '~~scores-' + index
	})
	let scores = []

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
		let keys = results.filter((element, index) => {
			if (index % 2) {
				scores.push(element)
				return false
			} else {
				return true
			}
		})
		
		// Get all the snippets
		let getPromises = keys.map(key => {
			return client.getAsync(key)
		})

		bluebird.all(getPromises)
		.then(responses => {
			// Parse and return
			parsed = responses.map((str, index) => {
				let obj = JSON.parse(str)
				obj.score = scores[index]
				return obj
			})

			event.sender.send('query-result', parsed)
		})
	})
}

module.exports = query


