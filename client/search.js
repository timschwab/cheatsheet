const {ipcRenderer} = require('electron')
const $ = require('jquery')
const he = require('he')

$(() => {
	// Watch for a query
	$('#query').change(search)
});

function search() {
	let query = this.value

	if (query) {
		ipcRenderer.send('search', query)
	} else {
		$('#message').html('')
		$('#results').html('')
	}
}

ipcRenderer.on('search-result', (event, results) => {
	if (results.length == 0) {
		$('#message').html('Search returned no results :(')
		$('#results').html('')
	} else {
		$('#message').html('Showing ' + results.length + ' results.')
		$('#results').html('')
		results.forEach(snippet => {
			let html = '<hr /><div class="snippet">'
			html += '<p class="problem"><a href="#" onclick="get(' + snippet.key + ');">' + he.encode(snippet.problem) + '</a></p>'
			html += '<p class="score">' + he.encode(snippet.score) + '</p>'
			html += '</div>'
			$('#results').append(html)
		});
	}
})

function get(key) {
	ipcRenderer.send('get', key)
}

ipcRenderer.on('get-result', (event, snippet) => {
	console.log(snippet)
})