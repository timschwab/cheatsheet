const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

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
	watch: {
		query: function(q) {
			if (q) {
				ipcRenderer.send('search', q)
			} else {
				vm.results = []
				this.$emit('message', 'Enter a search query')
			}
		}
	},
	template: `
		<div id="search-page">
			<div>
				<p><button class="btn" v-on:click="$emit('page', 'add')">Add a snippet</button></p>
			</div>
			
			<div class="form-group">
				<label for="query">Search query:</label>
				<input class="form-control" id="query" type="text" v-model="query">
			</div>
			
			<snippet-preview
				v-for="snippet in results"
				:snippet="snippet"
				:key="snippet.key"
				v-on:page="$emit('page', $event)"
			></snippet-preview>
		</div>
	`
})

// Server responds with search results
ipcRenderer.on('search-result', (event, results) => {
	vm.results = results

	if (results.length == 0) {
		vm.$emit('message', 'Search returned no results :\'(')
	} else {
		vm.$emit('message', 'Showing ' + results.length + ' results.')
	}
})

// If a snippet is deleted, make sure it is removed from the search results
ipcRenderer.on('delete-result', (event, result) => {
	if (result.status == 'success') {
		vm.results = vm.results.filter(snippet => {
			return snippet.key != result.id
		})
	}
})



Vue.component('snippet-preview', {
	props: ['snippet'],
	template: `
		<div class="snippet-preview">
			<hr />
			<p><a href="#" v-on:click="viewFull">{{ snippet.problem }}</a></p>
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