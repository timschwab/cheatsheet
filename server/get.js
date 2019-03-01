function snippetGet(event, client, id) {
	console.log('get: ' + id)

	redisGet(client, id).then(snippetText => {
		let snippet = JSON.parse(snippetText)
		event.sender.send('get-result', snippet)
	})
}

function redisGet(client, id) {
	let promise = client.getAsync(id)

	return promise
}

module.exports = {
	get: snippetGet,
	redisGet: redisGet
}
