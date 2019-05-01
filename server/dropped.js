const api = require('./redis-api')

function snippetsGet(event, data) {
	console.log('get:dropped:')
	console.log(data)

	// Get the dropped snippets
	api.getDropped(data).then(snippets => {
		event.sender.send('get:dropped-result', snippets)
	})
}

function snippetRestore(event, id) {
	console.log('restore: ' + id)

	// Restore the snippet
	api.restore(id).then(result => {
		event.sender.send('restore-result', {
			status: 'success'
		})
	})
}

function snippetDestroy(event, id) {
	console.log('destroy: ' + id)

	// Destroy the snippet
	api.destroy(id).then(result => {
		event.sender.send('destroy-result', {
			status: 'success'
		})
	})
}

module.exports = {
	get: snippetsGet,
	restore: snippetRestore,
	destroy: snippetDestroy
}
