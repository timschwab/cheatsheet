const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')
const he = require('he')

let vm

Vue.component('view-page', {
	created: function() {
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
	watch: {
		snippetKey: get
	},
	template: `
		<div id="view-page">
			<div id="view-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
				<p><button v-on:click="deleteSnippet">Delete this snippet</button></p>
			</div>
			<div id="view-results">
				<p class="problem">{{ encoded.problem }}</p>
				<p class="solution">{{ encoded.solution }}</p>
				<p class="keywords">{{ encoded.keywords }}</p>
			</div>
		</div>
	`,
	methods: {
		deleteSnippet: function() {
			if (this.snippetKey) {
				ipcRenderer.send('delete', this.snippetKey)
			}
		}
	}
})

// User views a snippet
function get(key) {
	if (key) {
		ipcRenderer.send('get', key)
	}
}

// Server responds with snippet data
ipcRenderer.on('get-result', (event, snippet) => {
	vm.snippet = snippet
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

module.exports = {}