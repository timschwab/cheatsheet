const api = require('./redis-api');

// Add to redis and send back success message to client
function snippetAdd(event, data) {
	console.log('add:');
	console.log(data);

	// Add snippet to the sheet
	api.add(data).then(results => {
		event.sender.send('add-result', {
			status: 'success'
		});
	});
}

module.exports = {
	add: snippetAdd
};
