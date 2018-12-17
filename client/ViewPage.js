const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')
const he = require('he')

let vm

// Define the view page
Vue.component('view-page', {
	create: function() {
		vm = this
	},
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
	computed: {
		encoded: function() {
			let problem = he.encode(this.snippet.problem)
			let solution = he.encode(this.snippet.solution)
			let keywords = he.encode(String(this.snippet.keywords))

			return {
				problem: problem,
				solution: solution,
				keywords: keywords
			}
		}
	},
	template: `
		<div id="view-page">
			<div id="view-links">
				<p><a href="#" onclick="show('search')">Back to search results</a></p>
				<p><a href="#" id="delete">Delete this snippet</a></p>
			</div>
			<div id="view-results">
				<p class="problem">{{ encoded.problem }}</p>
				<p class="solution">{{ encoded.solution }}</p>
				<p class="keywords">{{ encoded.keywords }}</p>
			</div>
		</div>`
})

// User views a snippet
function get(key) {
	// Set link handlers
	$('#delete').off()
	$('#delete').click(() => { deleteSnippet(key) })

	// Get data
	ipcRenderer.send('get', key)
}

// Server responds with snippet data
ipcRenderer.on('get-result', (event, snippet) => {
	vm.snippet = snippet
})

module.exports = {}