const {ipcRenderer} = require('electron')
const $ = require('jquery')
const he = require('he')

$(() => {
	// Watch for a query
	$('#query').change(query)
});

function query() {
	let q = this.value

	if (q) {
		ipcRenderer.send('query', q)
	} else {
		$('#message').html('')
		$('#results').html('')
	}
}

ipcRenderer.on('query-result', (event, results) => {
	if (results.length == 0) {
		$('#message').html('Could not find query.')
		$('#results').html('')
	} else {
		$('#message').html('Showing ' + results.length + ' results.')
		$('#results').html('')
		results.forEach(snippet => {
			let html = '<hr /><div class="snippet">'
			html += '<p class="problem">' + he.encode(snippet.problem) + '</p>'
			html += '<p class="solution">' + he.encode(snippet.solution) + '</p>'
			html += '<p class="keywords">' + he.encode(String(snippet.keywords)) + '</p>'
			html += '<p class="score">' + he.encode(snippet.score) + '</p>'
			html += '</div>'
			$('#results').append(html)
		});
	}
})