const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')
const he = require('he')

let vm

Vue.component('search-page', {
	data: function() {
		return {
			query: '',
			results: []
		}
	},
	computed: {
		message: function() {
			if (this.query == '') {
				return ''
			} else if (this.results.length == 0) {
				return 'Search returned no results :\'('
			} else {
				return 'Showing ' + this.results.length + ' results.'
			}
		}
	},
	watch: {
		query: search
	},
	template: `
		<div id="search-page">
			<div>
				<p><a href="#" onclick="show('add')">Add a snippet</a></p>
			</div>
			
			<div>
				Search query: <br />
				<input type="text" v-model="query">
			</div>
			
			<span>{{ message }}</span>
			<snippet-preview
				v-for="snippet in results"
				:snippet="snippet"
				:key="snippet.key"
			></snippet-preview>
		</div>`,
	created: function (){
		vm = this
	}
})

Vue.component('snippet-preview', {
	props: ['snippet'],
	computed: {
		encodedProblem: function() {
			return he.encode(this.snippet.problem)
		},
		getCommand: function() {
			return 'get(' + this.snippet.key + ')'
		}
	},
	template: `
		<div class="snippet-preview">
			<hr />
			<p><a href="#" :onclick="getCommand">{{ encodedProblem }}</a></p>
			<p>{{ snippet.score }}</p>
		</div>
	`
})

// User submits a search query
function search(val, oldVal) {
	if (val) {
		ipcRenderer.send('search', val)
	} else {
		vm.results = []
	}
}

// Server responds with search results
ipcRenderer.on('search-result', (event, results) => {
	vm.results = results
})

module.exports = {}