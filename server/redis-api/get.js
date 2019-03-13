function getSnippet(client, id) {
	let promise

	// Query redis for the text
	promise = client
		.getAsync(id)

		// Convert to object
		.then(text => {
			return new Promise((resolve, reject) => {
				resolve(JSON.parse(text))
			})
		})

	return promise
}

module.exports = {
	get: getSnippet
}
