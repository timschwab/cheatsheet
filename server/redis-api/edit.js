const deleteHandler = require('./delete')
const addHandler = require('./add')

// Replace the snippet at `id` with the snippet contained in `newData`
function editSnippet(client, id, newData) {
	let promise

	// Delete the old version
	promise = deleteHandler
		.fullDelete(client, id)

		// Add the new data
		.then(result => {
			return addHandler.simpleAdd(client, id, newData)
		})

		// Make the new data searchable
		.then(result => {
			return addHandler.indexAndScore(client, id)
		})

	return promise
}

module.exports.edit = editSnippet
