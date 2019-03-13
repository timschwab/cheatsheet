const api = require('./redis-api/api')

function snippetGet(event, id) {
	console.log('get: ' + id)

	// Get the snippet
	api
		.get(id)

		// Send it to the client
		.then(snippet => {
			event.sender.send('get-result', snippet)
		})
}

module.exports = {
	get: snippetGet
}
