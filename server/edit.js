const api = require('./redis-api')

function get(event, id) {
	console.log('edit:get: ' + id)

	api.get(id).then(snippet => {
		event.sender.send('edit:get-result', snippet)
	})
}

function change(event, data) {
	console.log('edit:change:')
	console.log(data)

	// Edit snippet
	api.edit(data.id, data).then(result => {
		event.sender.send('edit:change-result', {
			status: 'success'
		})
	})
}

module.exports = {
	get: get,
	change: change
}
