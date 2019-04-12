const api = require('./redis-api')

function snippetUndoableDelete(event, id) {
	console.log('undoable delete: ' + id)

	api.undoableDelete(id).then(result => {
		event.sender.send('delete-result', {
			status: 'success',
			id: id
		})
	})
}

module.exports = {
	delete: snippetUndoableDelete
}
