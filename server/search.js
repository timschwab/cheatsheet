const api = require('./redis-api/api')

// Receive query, process it, and send back the results
function snippetSearch(event, query) {
	console.log('search: ' + query)

	// Search the query
	api
		.search(query)

		// Then send the results to the client
		.then(results => {
			event.sender.send('search-result', results)
		})
}

module.exports = {
	search: snippetSearch
}
