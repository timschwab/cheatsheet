const api = require('./redis-api/api')

// Add to redis and send back success message to client
function snippetAdd(event, data) {
	console.log('add:')
	console.log(data)

	// Add snippet
	api
		.add(data)

		// Send back message to client
		.then(results => {
			event.sender.send('add-result', {
				status: 'success'
			})
		})
}

module.exports = {
	add: snippetAdd
}
