const api = require('./redis-api')

function snippetDrop(event, id) {
	console.log('drop: ' + id)

	api.drop(id).then(result => {
		event.sender.send('drop-result', {
			status: 'success',
			id: id
		})
	})
}

module.exports = {
	drop: snippetDrop
}
