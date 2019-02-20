const getHandler = require('./get')
const addHandler = require('./add')
const deleteHandler = require('./delete')

function get(event, client, id) {
	console.log('edit:get: ' + id)

	getHandler.redisGet(client, id).then(snippetText => {
		let snippet = JSON.parse(snippetText)
		event.sender.send('edit:get-result', snippet)
	})
}

function change(event, client, data) {
	console.log('edit:change:')
	console.log(data)

	// Delete snippet
	deleteHandler
		.redisPermanentDelete(client, data.key)

		// Re-add snippet
		.then(result => {
			return addHandler.redisAdd(client, data.key, data)
		})

		// Send response
		.then(result => {
			event.sender.send('edit:change-result', {
				status: 'success'
			})
		})
}

module.exports = {get: get, change: change}
