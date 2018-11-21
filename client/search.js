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
		$('#search-results').html('')
	}
}

ipcRenderer.on('search-result', (event, results) => {
	if (results.length == 0) {
		$('#message').html('Search returned no results :(')
		$('#search-results').html('')
	} else {
		$('#message').html('Showing ' + results.length + ' results.')
		$('#search-results').html('')
		results.forEach(snippet => {
			let html = '<hr /><div class="snippet">'
			html += '<p class="problem"><a href="#" onclick="get(' + snippet.key + ');">' + he.encode(snippet.problem) + '</a></p>'
			html += '<p class="score">' + he.encode(snippet.score) + '</p>'
			html += '</div>'
			$('#search-results').append(html)
		});
	}
})

function get(key) {
	ipcRenderer.send('get', key)
}

ipcRenderer.on('get-result', (event, snippet) => {
	let html = '<p class="problem">' + he.encode(snippet.problem) + '</p>'
	html += '<p class="solution">' + he.encode(snippet.solution) + '</p>'
	html += '<p class="solution">' + he.encode(String(snippet.keywords)) + '</p>'

	$('#view-results').html(html)

	$('#search-page').hide()
	$('#view-page').show()
})

function showSearchPage() {
	$('#search-page').show()
	$('#view-page').hide()
}

