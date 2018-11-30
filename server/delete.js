const bluebird = require('bluebird')

function deleteSnippet(event, client, id) {
	console.log('delete: ' + id)

	event.sender.send('delete-result', {status: 'success'})
}

module.exports = deleteSnippet