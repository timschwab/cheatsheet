// Receive data, process, add to Redis, and send back success message to client
function add(event, client, data) {
	console.log('Received add request:')
	console.log(data)
	
	event.sender.send('add-result', {
		status: 'success'
	})
}

module.exports = add