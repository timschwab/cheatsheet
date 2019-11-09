const api = require('./redis-api')

// Get the snippet then send it to the client
function snippetGet(event, id) {
	console.log('get: ' + id)

	// Get the snippet
	api.get(id).then(snippet => {
		event.sender.send('get-result', snippet)
	})
}

module.exports = {
	get: snippetGet
}
