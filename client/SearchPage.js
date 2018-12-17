const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')
const he = require('he')

let vm

Vue.component('search-page', {
	created: function (){
		vm = this
	},
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
				<p><button v-on:click="$emit('page', 'add')">Add a snippet</button></p>
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
				v-on:page="$emit('page', $event)"
			></snippet-preview>
		</div>`
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
			<p><a href="#" v-on:click="viewFull">{{ encodedProblem }}</a></p>
			<p>{{ snippet.score }}</p>
		</div>
	`,
	methods: {
		viewFull: function() {
			this.$emit('page', 'view:' + this.snippet.key)
		}
	}
})

module.exports = {}