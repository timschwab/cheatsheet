const bluebird = require('bluebird')

function get(event, client, id) {
	console.log('get: ' + id)

	client.getAsync(id)
	.then(snippetText => {
		let snippet = JSON.parse(snippetText)
		event.sender.send('get-result', snippet)
	})
}

module.exports = get