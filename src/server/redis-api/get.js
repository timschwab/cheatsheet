function getSnippet(client, id) {
	let promise;

	// Query redis for the text
	promise = client
		.getAsync(id)

		// Convert to object
		.then(text => {
			let obj = JSON.parse(text);
			obj.id = id;

			return Promise.resolve(obj);
		});

	return promise;
}

module.exports.get = getSnippet;
