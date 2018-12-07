const {ipcRenderer} = require('electron')
const $ = require('jquery')
const he = require('he')

// Watch for a query
$(() => {
	$('#query').on('input', search)
	$('#add-submit').on('click', add)
});

// Show a certain page
function show(page) {
	switch (page) {
		case 'search':
			$('#search-page').show()
			$('#view-page').hide()
			$('#add-page').hide()
			break
		case 'view':
			$('#search-page').hide()
			$('#view-page').show()
			$('#add-page').hide()
			break
		case 'add':
			$('#search-page').hide()
			$('#view-page').hide()
			$('#add-page').show()
			break
	}
}

// User submits a search query
function search() {
	let query = this.value

	if (query) {
		ipcRenderer.send('search', query)
	} else {
		$('#search-message').html('')
		$('#search-results').html('')
	}
}

// User views a snippet
function get(key) {
	$('#delete').click(() => { deleteSnippet(key) })
	ipcRenderer.send('get', key)
}

// User deletes a snippet
function deleteSnippet(key) {
	ipcRenderer.send('delete', key)
}

// User submits an add request
function add() {
	let problem = $('#problem').val()
	let solution = $('#solution').val()
	let keywords = $('#keywords').val()

	if (!problem) {
		$('#add-message').html('You gotta input a problem to add it, bro')
	} else if (!solution) {
		$('#add-message').html('It isn\'t very helpful to have a problem with no solution, now is it?')
	} else if (!keywords) {
		$('#add-message').html('Keywords are your friend')
	} else {
		keywords = keywords.split(/, |,/g)

		ipcRenderer.send('add', {
			problem: problem,
			solution: solution,
			keywords: keywords
		})
	}
}

// Server responds with search results
ipcRenderer.on('search-result', (event, results) => {
	if (results.length == 0) {
		$('#search-message').html('Search returned no results :\'(')
		$('#search-results').html('')
	} else {
		$('#search-message').html('Showing ' + results.length + ' results.')
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
	html += '<p class="keywords">' + he.encode(String(snippet.keywords)) + '</p>'

	$('#view-results').html(html)

	show('view')
})

// Server deleted a snippet
ipcRenderer.on('delete-result', (event, result) => {
	if (result.status == 'success') {
		$('#search-message').html('Snippet deleted.')
		$('#search-results').html('')
		show('search')
	} else {
		$('#search-message').html('Snippet could not be deleted: ' + results.message)
	}
})

// Server adds a snippet
ipcRenderer.on('add-result', (event, results) => {
	if (results.status == 'success') {
		$('#add-message').html('Successfully added')
		$('#problem').val('')
		$('#solution').val('')
		$('#keywords').val('')
	} else {
		$('#add-message').html('Could not add: ' + results.message)
	}
})







