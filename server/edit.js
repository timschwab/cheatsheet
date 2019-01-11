const bluebird = require('bluebird')

function get(event, client, id) {
	console.log('edit:get: ' + id)

	client.getAsync(id)
	.then(snippetText => {
		let snippet = JSON.parse(snippetText)
		event.sender.send('edit:get-result', snippet)
	})
}

function change(event, client, data) {
	console.log('edit:change:')
	console.log(data)
	
	event.sender.send('edit:change-result', {
		status: 'success'
	})
}

module.exports = {get: get, change: change}