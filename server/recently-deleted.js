const api = require('./redis-api/api')

const cutOffDays = 3
const millisecondsInDay = 1000 * 60 * 60 * 24

function snippetsGet(event, data) {
	console.log('get:deleted:')
	console.log(data)

	// Get the recently deleted snippets
	api.getRecentlyDeleted(data).then(snippets => {
		event.sender.send('get:deleted-result', snippets)
	})
}

function snippetRestore(event, id) {
	console.log('restore: ' + id)

	// Restore the snippet
	api.restoreRecentlyDeleted(id).then(result => {
		event.sender.send('restore-result', {
			status: 'success'
		})
	})
}

function snippetDelete(event, id) {
	console.log('delete:permanent: ' + id)

	// Permanently delete the snippet
	api.deleteRecentlyDeleted(id).then(result => {
		event.sender.send('delete:permanent-result', {
			status: 'success'
		})
	})
}

module.exports = {
	get: snippetsGet,
	restore: snippetRestore,
	delete: snippetDelete
}
