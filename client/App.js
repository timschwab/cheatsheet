const {ipcRenderer} = require('electron')
const $ = require('jquery')
const Vue = require('vue/dist/vue.js')
const he = require('he')

const searchPage = require('./SearchPage')

let vm

$(() => {
	vm = new Vue({
		el: '#app',
		data: {
			page: 'search'
		},
		computed: {
			showSearchPage: function() {
				return (this.page == 'search')
			},
			showViewPage: function() {
				return (this.page.slice(0,5) == 'view:')
			},
			showAddPage: function() {
				return (this.page == 'add')
			},
			viewingKey: function() {
				if (this.page.slice(0,5) == 'view:') {
					return this.page.slice(5)
				} else {
					return null
				}
			}
		},
		template: `
			<div>
				<search-page
					v-show="showSearchPage"
					v-on:page="page = $event"
				></search-page>

				<view-page
					v-show="showViewPage"
					v-on:page="page = $event"
					:snippet="viewingKey"
				></view-page>

				<add-page
					v-show="showAddPage"
					v-on:page="page = $event"
				></add-page>
			</div>
		`
	})
})

// Define the view page
Vue.component('view-page', {
	props: ['snippetKey'],
	data: function() {
		return {
			snippet: {
				problem: '',
				solution: '',
				keywords: []
			}
		}
	},
	template: `
		<div id="view-page">
			<div id="view-links">
				<p><a href="#" onclick="show('search')">Back to search results</a></p>
				<p><a href="#" id="delete">Delete this snippet</a></p>
			</div>
			<div id="view-results"></div>
		</div>`
})

// Define the add page
Vue.component('add-page', {
	data: function() {return {}},
	template: `
		<div id="add-page">
			<div id="add-links">
				<p><a href="#" onclick="show('search')">Back to search results</a></p>
			</div>

			<div id="form">
				<span>Problem:</span><input type="text" id="problem">
				<br />
				<span>Solution:</span><textarea id="solution"></textarea>
				<br />
				<span>Keywords:</span><input type="text" id="keywords">
				<br />
				<input type="button" value="Submit" id="add-submit">
			</div>

			<div id="add-message"></div>
		</div>`
})

// Show a certain page
function show(page) {
	vm.page = page
}

// Watch for adding a snippet
$(() => {
	$('#add-submit').on('click', add)
})

// User views a snippet
function get(key) {
	// Set link handlers
	$('#delete').off()
	$('#delete').click(() => { deleteSnippet(key) })

	// Get data
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







