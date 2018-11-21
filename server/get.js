const bluebird = require('bluebird')

function get(event, client, id) {
	event.sender.send('get-result', 'test - ' + id)
}

module.exports = get