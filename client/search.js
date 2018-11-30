const {ipcRenderer} = require('electron')
const $ = require('jquery')
const he = require('he')

// Watch for a query
$(() => {
	$('#query').on('input', search)
});

// User submits a search query
function search() {
	let query = this.value

	if (query) {
		ipcRenderer.send('search', query)
	} else {
		$('#message').html('')
		$('#search-results').html('')
	}
}

// Client views a snippet
function get(key) {
	$('#delete').click(() => { deleteSnippet(key) })
	ipcRenderer.send('get', key)
}

// Client deletes a snippet
function deleteSnippet(key) {
	ipcRenderer.send('delete', key)
}

// Show the search page, hiding the view page
function showSearchPage() {
	$('#search-page').show()
	$('#view-page').hide()
}

// Show the view page, hiding the search page
function showViewPage() {
	$('#search-page').hide()
	$('#view-page').show()
}

// Server responds with search results
ipcRenderer.on('search-result', (event, results) => {
	if (results.length == 0) {
		$('#message').html('Search returned no results :\'(')
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

// Server responds with snippet data
ipcRenderer.on('get-result', (event, snippet) => {
	let html = '<p class="problem">' + he.encode(snippet.problem) + '</p>'
	html += '<p class="solution">' + he.encode(snippet.solution) + '</p>'
	html += '<p class="solution">' + he.encode(String(snippet.keywords)) + '</p>'

	$('#view-results').html(html)

	showViewPage()
})

// Server deleted a snippet
ipcRenderer.on('delete-result', (event, result) => {
	if (result.status == 'success') {
		$('#message').html('Snippet deleted.')
		$('#search-results').html('')
		showSearchPage()
	} else {
		$('#message').html('Snippet could not be deleted: ' + results.message)
	}
})







